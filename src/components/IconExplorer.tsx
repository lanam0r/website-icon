import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AutoSizer,
  Grid,
  WindowScroller,
  GridCellProps,
} from "react-virtualized";
import Router from "next/router";

import * as JSSearch from "js-search";
import icons from "styled-icons/manifest.json";

import { IconCard } from "./IconCard";

interface IconType {
  importPath: string;
  name: string;
  originalName: string;
  pack: string;
}

const searchIndex = new JSSearch.Search("importPath");
searchIndex.searchIndex = new JSSearch.UnorderedSearchIndex();
searchIndex.indexStrategy = new JSSearch.AllSubstringsIndexStrategy();
searchIndex.addIndex("name");
searchIndex.addIndex("originalName");
searchIndex.addIndex("pack");
searchIndex.addDocuments(icons as unknown as IconType[]);

const IconExplorer: React.FC = () => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("s") ?? "");
  }, []);

  const filteredIcons = useMemo(() => {
    if (!search) return icons as unknown as IconType[];
    return searchIndex.search(search) as IconType[];
  }, [search]);

  const updateSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value;
      setSearch(next);

      void Router.replace(
        { pathname: "/", query: next ? { s: next } : {} },
        undefined,
        { shallow: true, scroll: false },
      );
    },
    [],
  );

  return (
    <div>
      <input
        className="search-box"
        type="text"
        onChange={updateSearch}
        value={search}
        placeholder="search icons"
        aria-label="search icons"
      />

      <WindowScroller>
        {({ height, isScrolling, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => {
              const columnCount = width > 755 ? 3 : width < 600 ? 1 : 2;
              const rowCount = Math.ceil(filteredIcons.length / columnCount);
              const columnWidth = Math.floor(width / columnCount);

              const cellRenderer = ({
                columnIndex,
                key,
                rowIndex,
                style,
              }: GridCellProps) => {
                const idx = rowIndex * columnCount + columnIndex;
                if (idx >= filteredIcons.length) return null;

                const { importPath, name, pack } = filteredIcons[idx];

                return (
                  <div className="icon-card-wrapper" key={key} style={style}>
                    <IconCard name={name} pack={pack} key={importPath} />
                  </div>
                );
              };

              return (
                <Grid
                  autoHeight
                  cellRenderer={cellRenderer}
                  columnCount={columnCount}
                  columnWidth={columnWidth}
                  height={height}
                  isScrolling={isScrolling}
                  rowCount={rowCount}
                  rowHeight={120}
                  scrollTop={scrollTop}
                  width={width}
                />
              );
            }}
          </AutoSizer>
        )}
      </WindowScroller>
    </div>
  );
};

export default IconExplorer;
