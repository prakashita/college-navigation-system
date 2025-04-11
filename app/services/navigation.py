import heapq
from sqlalchemy.orm import Session
from app.models.map import Location, Facility, ParkingSpot, Path
from collections import defaultdict


def build_graph(db: Session):
    graph = defaultdict(list)
    paths = db.query(Path).all()
    
    for path in paths:
        graph[(path.source_id, path.source_type)].append(((path.dest_id, path.dest_type), path.distance))
        graph[(path.dest_id, path.dest_type)].append(((path.source_id, path.source_type), path.distance))  # Bidirectional

    return graph

def compute_shortest_path(db: Session, start_id: int, start_type: str, end_id: int, end_type: str):
    graph = build_graph(db)
    
    # Min Heap (Priority Queue) for Dijkstra's Algorithm
    heap = [(0, (start_id, start_type), [])]  # (cost, current_node, path_so_far)
    visited = set()

    while heap:
        cost, (current_id, current_type), path = heapq.heappop(heap)

        if (current_id, current_type) in visited:
            continue
        visited.add((current_id, current_type))

        # Update path
        path = path + [(current_id, current_type)]

        # Found the destination
        if (current_id, current_type) == (end_id, end_type):
            return {"total_distance": cost, "path": path}

        # Traverse neighbors
        for (neighbor_id, neighbor_type), distance in graph[(current_id, current_type)]:
            if (neighbor_id, neighbor_type) not in visited:
                heapq.heappush(heap, (cost + distance, (neighbor_id, neighbor_type), path))

    return None  # No path found
