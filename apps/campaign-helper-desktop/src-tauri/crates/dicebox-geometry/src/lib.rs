use geo::algorithm::Validation;
use geo::{Contains, Coord, Intersects, LineString, Point as GeoPoint, Polygon, Rect};
use rstar::{RTree, RTreeObject, AABB};
use serde::{Deserialize, Serialize};
use std::collections::{BTreeMap, HashMap, HashSet};
use std::error::Error;
use std::fmt::{Display, Formatter};

pub const GEOMETRY_SCHEMA_VERSION: &str = "0.1.0";

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Bounds {
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GeometryEntity {
    pub id: String,
    pub bounds: Bounds,
    #[serde(default)]
    pub polygon: Option<Vec<Point>>,
    #[serde(default)]
    pub locked: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct OffsetRelationship {
    pub id: String,
    pub source_id: String,
    pub target_id: String,
    pub offset_x: f64,
    pub offset_y: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(
    tag = "kind",
    rename_all = "kebab-case",
    rename_all_fields = "camelCase",
    deny_unknown_fields
)]
pub enum GeometryOperation {
    TranslateEntity {
        operation_id: String,
        entity_id: String,
        delta_x: f64,
        delta_y: f64,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(
    tag = "kind",
    rename_all = "kebab-case",
    rename_all_fields = "camelCase",
    deny_unknown_fields
)]
pub enum SpatialQuery {
    IntersectsBounds { query_id: String, bounds: Bounds },
    ContainsPoint { query_id: String, point: Point },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GeometryBatchRequest {
    pub schema_version: String,
    pub document_id: String,
    pub base_revision: u64,
    pub scene_bounds: Bounds,
    pub entities: Vec<GeometryEntity>,
    #[serde(default)]
    pub relationships: Vec<OffsetRelationship>,
    #[serde(default)]
    pub operations: Vec<GeometryOperation>,
    #[serde(default)]
    pub queries: Vec<SpatialQuery>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GeometryPatch {
    pub entity_id: String,
    pub before: Bounds,
    pub after: Bounds,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SpatialQueryResult {
    pub query_id: String,
    pub entity_ids: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GeometryBatchStats {
    pub entity_count: usize,
    pub relationship_count: usize,
    pub operation_count: usize,
    pub query_count: usize,
    pub changed_entity_count: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GeometryBatchReceipt {
    pub operation: String,
    pub status: String,
    pub schema_version: String,
    pub document_id: String,
    pub before_revision: u64,
    pub after_revision: u64,
    pub patches: Vec<GeometryPatch>,
    pub query_results: Vec<SpatialQueryResult>,
    pub stats: GeometryBatchStats,
    pub no_write: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct GeometryFailure {
    pub operation: String,
    pub status: String,
    pub code: String,
    pub message: String,
    pub no_write: bool,
}

impl GeometryFailure {
    fn blocked(code: &str, message: impl Into<String>) -> Self {
        Self {
            operation: "dicebox.geometry.batch.commit".into(),
            status: "BLOCKED".into(),
            code: code.into(),
            message: message.into(),
            no_write: true,
        }
    }
}

impl Display for GeometryFailure {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        write!(formatter, "{}: {}", self.code, self.message)
    }
}

impl Error for GeometryFailure {}

#[derive(Clone)]
struct IndexedEntity {
    id: String,
    envelope: AABB<[f64; 2]>,
}

impl RTreeObject for IndexedEntity {
    type Envelope = AABB<[f64; 2]>;

    fn envelope(&self) -> Self::Envelope {
        self.envelope
    }
}

fn finite(values: &[f64]) -> bool {
    values.iter().all(|value| value.is_finite())
}

fn bounds_envelope(bounds: Bounds) -> AABB<[f64; 2]> {
    AABB::from_corners(
        [bounds.x, bounds.y],
        [bounds.x + bounds.width, bounds.y + bounds.height],
    )
}

fn bounds_inside_scene(bounds: Bounds, scene: Bounds) -> bool {
    finite(&[bounds.x, bounds.y, bounds.width, bounds.height])
        && bounds.width > 0.0
        && bounds.height > 0.0
        && bounds.x >= scene.x
        && bounds.y >= scene.y
        && bounds.x + bounds.width <= scene.x + scene.width
        && bounds.y + bounds.height <= scene.y + scene.height
}

fn polygon_for(points: &[Point]) -> Polygon<f64> {
    let mut coordinates = points
        .iter()
        .map(|point| Coord {
            x: point.x,
            y: point.y,
        })
        .collect::<Vec<_>>();
    if coordinates.first() != coordinates.last() {
        if let Some(first) = coordinates.first().copied() {
            coordinates.push(first);
        }
    }
    Polygon::new(LineString::new(coordinates), vec![])
}

fn validate_polygon(entity: &GeometryEntity) -> Result<(), GeometryFailure> {
    let Some(points) = &entity.polygon else {
        return Ok(());
    };
    if points.len() < 3 || points.iter().any(|point| !finite(&[point.x, point.y])) {
        return Err(GeometryFailure::blocked(
            "INVALID_POLYGON",
            format!("{} has too few or non-finite polygon points.", entity.id),
        ));
    }
    if points.iter().any(|point| {
        point.x < entity.bounds.x
            || point.y < entity.bounds.y
            || point.x > entity.bounds.x + entity.bounds.width
            || point.y > entity.bounds.y + entity.bounds.height
    }) {
        return Err(GeometryFailure::blocked(
            "INVALID_POLYGON",
            format!(
                "{} has polygon points outside its declared bounds.",
                entity.id
            ),
        ));
    }
    let polygon = polygon_for(points);
    let errors = polygon
        .validation_errors()
        .into_iter()
        .map(|error| error.to_string())
        .collect::<Vec<_>>();
    if !errors.is_empty() {
        return Err(GeometryFailure::blocked(
            "INVALID_POLYGON",
            format!("{}: {}", entity.id, errors.join("; ")),
        ));
    }
    Ok(())
}

fn validate_relationship_cycles(
    relationships: &[OffsetRelationship],
) -> Result<(), GeometryFailure> {
    let outgoing = relationships
        .iter()
        .map(|relationship| {
            (
                relationship.source_id.as_str(),
                relationship.target_id.as_str(),
            )
        })
        .collect::<Vec<_>>();
    fn visit<'a>(
        node: &'a str,
        outgoing: &[(&'a str, &'a str)],
        active: &mut HashSet<&'a str>,
        complete: &mut HashSet<&'a str>,
    ) -> bool {
        if complete.contains(node) {
            return false;
        }
        if !active.insert(node) {
            return true;
        }
        for (_, target) in outgoing.iter().filter(|(source, _)| *source == node) {
            if visit(target, outgoing, active, complete) {
                return true;
            }
        }
        active.remove(node);
        complete.insert(node);
        false
    }

    let mut active = HashSet::new();
    let mut complete = HashSet::new();
    for (source, _) in &outgoing {
        if visit(source, &outgoing, &mut active, &mut complete) {
            return Err(GeometryFailure::blocked(
                "RELATIONSHIP_CYCLE",
                "Offset relationships must be acyclic.",
            ));
        }
    }
    Ok(())
}

fn validate_request(request: &GeometryBatchRequest) -> Result<(), GeometryFailure> {
    if request.schema_version != GEOMETRY_SCHEMA_VERSION {
        return Err(GeometryFailure::blocked(
            "UNSUPPORTED_SCHEMA",
            format!(
                "Expected {}, found {}.",
                GEOMETRY_SCHEMA_VERSION, request.schema_version
            ),
        ));
    }
    if !request.document_id.starts_with("dbx:scene:") {
        return Err(GeometryFailure::blocked(
            "INVALID_DOCUMENT_ID",
            "Document ID must use the dbx:scene namespace.",
        ));
    }
    if !bounds_inside_scene(request.scene_bounds, request.scene_bounds) {
        return Err(GeometryFailure::blocked(
            "INVALID_SCENE_BOUNDS",
            "Scene bounds must be finite and positive.",
        ));
    }

    let mut entity_ids = HashSet::new();
    for entity in &request.entities {
        if !entity.id.starts_with("dbx:") || !entity_ids.insert(entity.id.as_str()) {
            return Err(GeometryFailure::blocked(
                "INVALID_ENTITY_ID",
                format!("Invalid or duplicate entity ID: {}", entity.id),
            ));
        }
        if !bounds_inside_scene(entity.bounds, request.scene_bounds) {
            return Err(GeometryFailure::blocked(
                "OUT_OF_BOUNDS",
                format!("{} is outside the Scene bounds.", entity.id),
            ));
        }
        validate_polygon(entity)?;
    }

    let mut relationship_ids = HashSet::new();
    let mut relationship_targets = HashSet::new();
    for relationship in &request.relationships {
        if relationship.id.trim().is_empty() || !relationship_ids.insert(relationship.id.as_str()) {
            return Err(GeometryFailure::blocked(
                "INVALID_RELATIONSHIP",
                "Relationship IDs must be unique and non-empty.",
            ));
        }
        if !entity_ids.contains(relationship.source_id.as_str())
            || !entity_ids.contains(relationship.target_id.as_str())
        {
            return Err(GeometryFailure::blocked(
                "UNKNOWN_ENTITY",
                format!(
                    "Relationship {} references an unknown entity.",
                    relationship.id
                ),
            ));
        }
        if !relationship_targets.insert(relationship.target_id.as_str()) {
            return Err(GeometryFailure::blocked(
                "AMBIGUOUS_RELATIONSHIP",
                format!("{} has more than one offset owner.", relationship.target_id),
            ));
        }
        if !finite(&[relationship.offset_x, relationship.offset_y]) {
            return Err(GeometryFailure::blocked(
                "INVALID_RELATIONSHIP",
                format!("{} has non-finite offsets.", relationship.id),
            ));
        }
    }
    validate_relationship_cycles(&request.relationships)?;
    Ok(())
}

fn translate_entity(entity: &mut GeometryEntity, delta_x: f64, delta_y: f64) {
    entity.bounds.x += delta_x;
    entity.bounds.y += delta_y;
    if let Some(points) = &mut entity.polygon {
        for point in points {
            point.x += delta_x;
            point.y += delta_y;
        }
    }
}

fn entity_intersects(entity: &GeometryEntity, bounds: Bounds) -> bool {
    if let Some(points) = &entity.polygon {
        let polygon = polygon_for(points);
        let query_rect = Rect::new(
            Coord {
                x: bounds.x,
                y: bounds.y,
            },
            Coord {
                x: bounds.x + bounds.width,
                y: bounds.y + bounds.height,
            },
        );
        polygon.intersects(&query_rect)
    } else {
        entity.bounds.x <= bounds.x + bounds.width
            && entity.bounds.x + entity.bounds.width >= bounds.x
            && entity.bounds.y <= bounds.y + bounds.height
            && entity.bounds.y + entity.bounds.height >= bounds.y
    }
}

fn entity_contains(entity: &GeometryEntity, point: Point) -> bool {
    if let Some(points) = &entity.polygon {
        polygon_for(points).contains(&GeoPoint::new(point.x, point.y))
    } else {
        point.x >= entity.bounds.x
            && point.x <= entity.bounds.x + entity.bounds.width
            && point.y >= entity.bounds.y
            && point.y <= entity.bounds.y + entity.bounds.height
    }
}

pub fn commit_geometry_batch(
    request: GeometryBatchRequest,
) -> Result<GeometryBatchReceipt, GeometryFailure> {
    validate_request(&request)?;
    let before = request
        .entities
        .iter()
        .map(|entity| (entity.id.clone(), entity.bounds))
        .collect::<BTreeMap<_, _>>();
    let mut entities = request
        .entities
        .iter()
        .cloned()
        .map(|entity| (entity.id.clone(), entity))
        .collect::<BTreeMap<_, _>>();
    let mut operation_ids = HashSet::new();
    let derived_entity_ids = request
        .relationships
        .iter()
        .map(|relationship| relationship.target_id.as_str())
        .collect::<HashSet<_>>();

    for operation in &request.operations {
        match operation {
            GeometryOperation::TranslateEntity {
                operation_id,
                entity_id,
                delta_x,
                delta_y,
            } => {
                if operation_id.trim().is_empty()
                    || !operation_ids.insert(operation_id.as_str())
                    || !finite(&[*delta_x, *delta_y])
                    || (*delta_x == 0.0 && *delta_y == 0.0)
                {
                    return Err(GeometryFailure::blocked(
                        "INVALID_OPERATION",
                        "Operation IDs and finite non-zero translations are required.",
                    ));
                }
                if derived_entity_ids.contains(entity_id.as_str()) {
                    return Err(GeometryFailure::blocked(
                        "DERIVED_ENTITY",
                        format!("{} is positioned by an offset relationship.", entity_id),
                    ));
                }
                let entity = entities.get_mut(entity_id).ok_or_else(|| {
                    GeometryFailure::blocked(
                        "UNKNOWN_ENTITY",
                        format!("Unknown entity: {}", entity_id),
                    )
                })?;
                if entity.locked {
                    return Err(GeometryFailure::blocked(
                        "LOCKED_ENTITY",
                        format!("{} is locked.", entity_id),
                    ));
                }
                translate_entity(entity, *delta_x, *delta_y);
                if !bounds_inside_scene(entity.bounds, request.scene_bounds) {
                    return Err(GeometryFailure::blocked(
                        "OUT_OF_BOUNDS",
                        format!("{} would leave the Scene bounds.", entity_id),
                    ));
                }
            }
        }
    }

    let mut relationships = request.relationships.clone();
    relationships.sort_by(|left, right| left.id.cmp(&right.id));
    for _ in 0..relationships.len().max(1) {
        for relationship in &relationships {
            let source = entities
                .get(&relationship.source_id)
                .expect("validated source")
                .bounds;
            let target = entities
                .get_mut(&relationship.target_id)
                .expect("validated target");
            let next_x = source.x + relationship.offset_x;
            let next_y = source.y + relationship.offset_y;
            let delta_x = next_x - target.bounds.x;
            let delta_y = next_y - target.bounds.y;
            if delta_x != 0.0 || delta_y != 0.0 {
                if target.locked {
                    return Err(GeometryFailure::blocked(
                        "LOCKED_ENTITY",
                        format!("{} is locked.", relationship.target_id),
                    ));
                }
                translate_entity(target, delta_x, delta_y);
                if !bounds_inside_scene(target.bounds, request.scene_bounds) {
                    return Err(GeometryFailure::blocked(
                        "OUT_OF_BOUNDS",
                        format!(
                            "Relationship {} moves {} outside the Scene.",
                            relationship.id, relationship.target_id
                        ),
                    ));
                }
            }
        }
    }

    for entity in entities.values() {
        validate_polygon(entity)?;
    }

    let index = RTree::bulk_load(
        entities
            .values()
            .map(|entity| IndexedEntity {
                id: entity.id.clone(),
                envelope: bounds_envelope(entity.bounds),
            })
            .collect(),
    );
    let entity_lookup = entities
        .iter()
        .map(|(id, entity)| (id.as_str(), entity))
        .collect::<HashMap<_, _>>();
    let mut query_results = Vec::with_capacity(request.queries.len());
    let mut query_ids = HashSet::new();
    for query in &request.queries {
        let (query_id, mut ids) = match query {
            SpatialQuery::IntersectsBounds { query_id, bounds } => {
                if !bounds_inside_scene(*bounds, request.scene_bounds) {
                    return Err(GeometryFailure::blocked(
                        "INVALID_QUERY",
                        format!("{} has invalid bounds.", query_id),
                    ));
                }
                let ids = index
                    .locate_in_envelope_intersecting(bounds_envelope(*bounds))
                    .filter(|item| entity_intersects(entity_lookup[item.id.as_str()], *bounds))
                    .map(|item| item.id.clone())
                    .collect::<Vec<_>>();
                (query_id, ids)
            }
            SpatialQuery::ContainsPoint { query_id, point } => {
                if !finite(&[point.x, point.y]) {
                    return Err(GeometryFailure::blocked(
                        "INVALID_QUERY",
                        format!("{} has a non-finite point.", query_id),
                    ));
                }
                let envelope = AABB::from_point([point.x, point.y]);
                let ids = index
                    .locate_in_envelope_intersecting(envelope)
                    .filter(|item| entity_contains(entity_lookup[item.id.as_str()], *point))
                    .map(|item| item.id.clone())
                    .collect::<Vec<_>>();
                (query_id, ids)
            }
        };
        if query_id.trim().is_empty() || !query_ids.insert(query_id.as_str()) {
            return Err(GeometryFailure::blocked(
                "INVALID_QUERY",
                "Query IDs must be unique and non-empty.",
            ));
        }
        ids.sort();
        query_results.push(SpatialQueryResult {
            query_id: query_id.clone(),
            entity_ids: ids,
        });
    }

    let patches = entities
        .iter()
        .filter_map(|(id, entity)| {
            let prior = before[id];
            (prior != entity.bounds).then(|| GeometryPatch {
                entity_id: id.clone(),
                before: prior,
                after: entity.bounds,
            })
        })
        .collect::<Vec<_>>();

    Ok(GeometryBatchReceipt {
        operation: "dicebox.geometry.batch.commit".into(),
        status: "PASS".into(),
        schema_version: GEOMETRY_SCHEMA_VERSION.into(),
        document_id: request.document_id,
        before_revision: request.base_revision,
        after_revision: request.base_revision + u64::from(!patches.is_empty()),
        stats: GeometryBatchStats {
            entity_count: entities.len(),
            relationship_count: request.relationships.len(),
            operation_count: request.operations.len(),
            query_count: request.queries.len(),
            changed_entity_count: patches.len(),
        },
        patches,
        query_results,
        // The kernel returns a reviewed patch; applying it remains the semantic
        // command layer's responsibility, so this native boundary performs no
        // project, filesystem, or Foundry write.
        no_write: true,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::Instant;

    fn entity(id: &str, x: f64, y: f64) -> GeometryEntity {
        GeometryEntity {
            id: id.into(),
            bounds: Bounds {
                x,
                y,
                width: 20.0,
                height: 20.0,
            },
            polygon: None,
            locked: false,
        }
    }

    fn request() -> GeometryBatchRequest {
        GeometryBatchRequest {
            schema_version: GEOMETRY_SCHEMA_VERSION.into(),
            document_id: "dbx:scene:rust-kernel-fixture".into(),
            base_revision: 7,
            scene_bounds: Bounds {
                x: 0.0,
                y: 0.0,
                width: 1000.0,
                height: 1000.0,
            },
            entities: vec![
                entity("dbx:entity:source", 100.0, 100.0),
                entity("dbx:entity:target", 140.0, 100.0),
            ],
            relationships: vec![OffsetRelationship {
                id: "dbx:relationship:target-follows-source".into(),
                source_id: "dbx:entity:source".into(),
                target_id: "dbx:entity:target".into(),
                offset_x: 40.0,
                offset_y: 0.0,
            }],
            operations: vec![GeometryOperation::TranslateEntity {
                operation_id: "dbx:operation:move-source".into(),
                entity_id: "dbx:entity:source".into(),
                delta_x: 25.0,
                delta_y: 10.0,
            }],
            queries: vec![
                SpatialQuery::IntersectsBounds {
                    query_id: "dbx:query:changed-area".into(),
                    bounds: Bounds {
                        x: 120.0,
                        y: 100.0,
                        width: 70.0,
                        height: 40.0,
                    },
                },
                SpatialQuery::ContainsPoint {
                    query_id: "dbx:query:source-center".into(),
                    point: Point { x: 130.0, y: 115.0 },
                },
            ],
        }
    }

    #[test]
    fn commits_a_translation_and_relationship_as_one_batch() {
        let receipt = commit_geometry_batch(request()).expect("batch should pass");
        assert_eq!(receipt.before_revision, 7);
        assert_eq!(receipt.after_revision, 8);
        assert_eq!(receipt.patches.len(), 2);
        assert_eq!(receipt.patches[0].entity_id, "dbx:entity:source");
        assert_eq!(receipt.patches[0].after.x, 125.0);
        assert_eq!(receipt.patches[1].after.x, 165.0);
        assert_eq!(
            receipt.query_results[1].entity_ids,
            vec!["dbx:entity:source"]
        );
    }

    #[test]
    fn rejects_locked_and_out_of_bounds_commits() {
        let mut locked = request();
        locked.entities[0].locked = true;
        assert_eq!(
            commit_geometry_batch(locked).unwrap_err().code,
            "LOCKED_ENTITY"
        );

        let mut outside = request();
        outside.operations[0] = GeometryOperation::TranslateEntity {
            operation_id: "dbx:operation:outside".into(),
            entity_id: "dbx:entity:source".into(),
            delta_x: -200.0,
            delta_y: 0.0,
        };
        assert_eq!(
            commit_geometry_batch(outside).unwrap_err().code,
            "OUT_OF_BOUNDS"
        );
    }

    #[test]
    fn rejects_relationship_cycles_and_ambiguous_owners() {
        let mut cycle = request();
        cycle.relationships.push(OffsetRelationship {
            id: "dbx:relationship:cycle".into(),
            source_id: "dbx:entity:target".into(),
            target_id: "dbx:entity:source".into(),
            offset_x: -40.0,
            offset_y: 0.0,
        });
        assert_eq!(
            commit_geometry_batch(cycle).unwrap_err().code,
            "RELATIONSHIP_CYCLE"
        );

        let mut ambiguous = request();
        ambiguous
            .entities
            .push(entity("dbx:entity:other", 200.0, 100.0));
        ambiguous.relationships.push(OffsetRelationship {
            id: "dbx:relationship:ambiguous".into(),
            source_id: "dbx:entity:other".into(),
            target_id: "dbx:entity:target".into(),
            offset_x: -35.0,
            offset_y: 0.0,
        });
        assert_eq!(
            commit_geometry_batch(ambiguous).unwrap_err().code,
            "AMBIGUOUS_RELATIONSHIP"
        );
    }

    #[test]
    fn rejects_self_intersecting_polygons() {
        let mut invalid = request();
        invalid.entities[0].polygon = Some(vec![
            Point { x: 100.0, y: 100.0 },
            Point { x: 120.0, y: 120.0 },
            Point { x: 100.0, y: 120.0 },
            Point { x: 120.0, y: 100.0 },
        ]);
        let error = commit_geometry_batch(invalid).unwrap_err();
        assert_eq!(error.code, "INVALID_POLYGON");
        assert!(error.message.contains("self-intersection"));
    }

    #[test]
    fn accepts_unclosed_valid_polygons_and_rejects_points_outside_declared_bounds() {
        let mut valid = request();
        valid.entities[0].polygon = Some(vec![
            Point { x: 100.0, y: 100.0 },
            Point { x: 120.0, y: 100.0 },
            Point { x: 110.0, y: 120.0 },
        ]);
        assert!(commit_geometry_batch(valid).is_ok());

        let mut outside = request();
        outside.entities[0].polygon = Some(vec![
            Point { x: 100.0, y: 100.0 },
            Point { x: 125.0, y: 100.0 },
            Point { x: 110.0, y: 120.0 },
        ]);
        let error = commit_geometry_batch(outside).unwrap_err();
        assert_eq!(error.code, "INVALID_POLYGON");
        assert!(error.message.contains("outside its declared bounds"));
    }

    #[test]
    fn rejects_direct_or_locked_relationship_target_moves() {
        let mut direct = request();
        direct.operations[0] = GeometryOperation::TranslateEntity {
            operation_id: "dbx:operation:move-derived".into(),
            entity_id: "dbx:entity:target".into(),
            delta_x: 8.0,
            delta_y: 0.0,
        };
        assert_eq!(
            commit_geometry_batch(direct).unwrap_err().code,
            "DERIVED_ENTITY"
        );

        let mut locked = request();
        locked.entities[1].locked = true;
        assert_eq!(
            commit_geometry_batch(locked).unwrap_err().code,
            "LOCKED_ENTITY"
        );
    }

    #[test]
    fn emits_byte_equivalent_receipts_for_identical_batches() {
        let first = serde_json::to_vec(&commit_geometry_batch(request()).unwrap()).unwrap();
        let second = serde_json::to_vec(&commit_geometry_batch(request()).unwrap()).unwrap();
        assert_eq!(first, second);
    }

    #[test]
    fn bulk_loads_and_queries_ten_thousand_entities_within_the_local_budget() {
        let entities = (0..10_000)
            .map(|index| {
                entity(
                    &format!("dbx:entity:bulk-{index:05}"),
                    (index % 100) as f64 * 5.0,
                    (index / 100) as f64 * 5.0,
                )
            })
            .collect();
        let batch = GeometryBatchRequest {
            schema_version: GEOMETRY_SCHEMA_VERSION.into(),
            document_id: "dbx:scene:rust-kernel-bulk".into(),
            base_revision: 0,
            scene_bounds: Bounds {
                x: 0.0,
                y: 0.0,
                width: 600.0,
                height: 600.0,
            },
            entities,
            relationships: vec![],
            operations: vec![],
            queries: vec![SpatialQuery::IntersectsBounds {
                query_id: "dbx:query:center".into(),
                bounds: Bounds {
                    x: 200.0,
                    y: 200.0,
                    width: 100.0,
                    height: 100.0,
                },
            }],
        };
        let started = Instant::now();
        let receipt = commit_geometry_batch(batch).unwrap();
        assert!(started.elapsed().as_millis() < 2_000);
        assert_eq!(receipt.stats.entity_count, 10_000);
        assert!(!receipt.query_results[0].entity_ids.is_empty());
    }
}
