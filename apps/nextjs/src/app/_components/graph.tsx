"use client";

import { useEffect, useMemo } from "react";
import ForceGraph from "react-force-graph-3d";

import { Button } from "@senka/ui/button";

import { api } from "~/trpc/react";

export function Graph() {
  const [{ links, nodes }] = api.user.graph.useSuspenseQuery();

  const invalidateGraph = () => {
    const utils = api.useUtils();
    utils.user.graph.invalidate();
  };

  useEffect(() => {
    console.log(nodes);
  }, [nodes]);

  useEffect(() => {
    console.log(links);
  }, [links]);

  const graphData = useMemo(() => {
    return {
      nodes: nodes,
      links: links,
    };
  }, [nodes, links]);

  return (
    <>
      <div className="absolute left-0 top-0">
        <Button onClick={invalidateGraph}>Refetch</Button>
      </div>
      <ForceGraph
        graphData={graphData}
        enableNodeDrag={false}
        nodeId="id"
        nodeLabel="name"
        nodeVal={(node) => node.val}
        nodeColor={(node) => {
          switch (node.type) {
            case "user":
              return "#ff6b6b";
            case "post":
              return "#4ecdc4";
            case "domain":
              return "#45b7d1";
            default:
              return "#666";
          }
        }}
        linkSource="source"
        linkTarget="target"
        linkLabel="name"
        linkColor={(link) => {
          switch (link.type) {
            case "follows":
              return "#ff9f43";
            case "posted":
              return "#4ecdc4";
            case "links_to":
              return "#45b7d1";
            default:
              return "#666";
          }
        }}
        // nodeAutoColorBy="group"

        linkDirectionalArrowLength={3.5} // Arrow size
        linkDirectionalArrowRelPos={1} // Arrow position along line
        linkCurvature={0.2} // Add curve to better show bidirectional links
      />
    </>
  );
}
