use dicebox_geometry::{
    commit_geometry_batch, Bounds, GeometryBatchRequest, GeometryEntity, GeometryOperation,
    OffsetRelationship, SpatialQuery, GEOMETRY_SCHEMA_VERSION,
};
use serde::Serialize;
use std::time::Instant;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct BenchmarkReceipt {
    operation: &'static str,
    status: &'static str,
    corpus: &'static str,
    entity_count: usize,
    relationship_count: usize,
    operation_count: usize,
    query_count: usize,
    changed_entity_count: usize,
    elapsed_ms: u128,
    budget_ms: u128,
    deterministic_reread: bool,
    no_external_write: bool,
}

fn entity(index: usize) -> GeometryEntity {
    GeometryEntity {
        id: format!("dbx:benchmark:entity-{index:05}"),
        bounds: Bounds {
            x: (index % 128) as f64 * 10.0,
            y: (index / 128) as f64 * 10.0,
            width: 2.0,
            height: 2.0,
        },
        polygon: None,
        locked: false,
    }
}

fn request() -> GeometryBatchRequest {
    GeometryBatchRequest {
        schema_version: GEOMETRY_SCHEMA_VERSION.into(),
        document_id: "dbx:scene:native-geometry-benchmark".into(),
        base_revision: 11,
        scene_bounds: Bounds {
            x: 0.0,
            y: 0.0,
            width: 1536.0,
            height: 1024.0,
        },
        entities: (0..10_000).map(entity).collect(),
        relationships: vec![OffsetRelationship {
            id: "dbx:relationship:benchmark-follow".into(),
            source_id: "dbx:benchmark:entity-00000".into(),
            target_id: "dbx:benchmark:entity-00001".into(),
            offset_x: 10.0,
            offset_y: 0.0,
        }],
        operations: vec![GeometryOperation::TranslateEntity {
            operation_id: "dbx:operation:benchmark-translate".into(),
            entity_id: "dbx:benchmark:entity-00000".into(),
            delta_x: 8.0,
            delta_y: 8.0,
        }],
        queries: vec![
            SpatialQuery::IntersectsBounds {
                query_id: "dbx:query:benchmark-center".into(),
                bounds: Bounds {
                    x: 200.0,
                    y: 200.0,
                    width: 100.0,
                    height: 100.0,
                },
            },
            SpatialQuery::ContainsPoint {
                query_id: "dbx:query:benchmark-source".into(),
                point: dicebox_geometry::Point { x: 9.0, y: 9.0 },
            },
        ],
    }
}

fn main() {
    let batch = request();
    let started = Instant::now();
    let first = commit_geometry_batch(batch.clone()).expect("benchmark corpus must pass");
    let elapsed_ms = started.elapsed().as_millis();
    let second = commit_geometry_batch(batch).expect("benchmark reread must pass");
    let budget_ms = 2_000;
    let deterministic_reread = first == second;
    let status = if elapsed_ms <= budget_ms && deterministic_reread {
        "PASS"
    } else {
        "BLOCKED"
    };
    let receipt = BenchmarkReceipt {
        operation: "dicebox.geometry.benchmark",
        status,
        corpus: "10k-entities-one-relationship-one-commit-two-queries",
        entity_count: first.stats.entity_count,
        relationship_count: first.stats.relationship_count,
        operation_count: first.stats.operation_count,
        query_count: first.stats.query_count,
        changed_entity_count: first.stats.changed_entity_count,
        elapsed_ms,
        budget_ms,
        deterministic_reread,
        no_external_write: first.no_write,
    };
    println!(
        "{}",
        serde_json::to_string_pretty(&receipt).expect("serialize receipt")
    );
    if status != "PASS" {
        std::process::exit(1);
    }
}
