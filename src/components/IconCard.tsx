import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import copy from "copy-to-clipboard";
import type { StyledIcon } from "styled-icons/types";

type TPackModule = Record<string, unknown>;

const importMap: Record<string, Promise<TPackModule>> = {
  bootstrap: import("styled-icons/bootstrap") as Promise<TPackModule>,
  "boxicons-logos": import(
    "styled-icons/boxicons-logos"
  ) as Promise<TPackModule>,
  "boxicons-regular": import(
    "styled-icons/boxicons-regular"
  ) as Promise<TPackModule>,
  "boxicons-solid": import(
    "styled-icons/boxicons-solid"
  ) as Promise<TPackModule>,
  crypto: import("styled-icons/crypto") as Promise<TPackModule>,
  entypo: import("styled-icons/entypo") as Promise<TPackModule>,
  "entypo-social": import("styled-icons/entypo-social") as Promise<TPackModule>,
  "evaicons-outline": import(
    "styled-icons/evaicons-outline"
  ) as Promise<TPackModule>,
  "evaicons-solid": import(
    "styled-icons/evaicons-solid"
  ) as Promise<TPackModule>,
  evil: import("styled-icons/evil") as Promise<TPackModule>,
  "fa-brands": import("styled-icons/fa-brands") as Promise<TPackModule>,
  "fa-regular": import("styled-icons/fa-regular") as Promise<TPackModule>,
  "fa-solid": import("styled-icons/fa-solid") as Promise<TPackModule>,
  feather: import("styled-icons/feather") as Promise<TPackModule>,
  "fluentui-system-filled": import(
    "styled-icons/fluentui-system-filled"
  ) as Promise<TPackModule>,
  "fluentui-system-regular": import(
    "styled-icons/fluentui-system-regular"
  ) as Promise<TPackModule>,
  foundation: import("styled-icons/foundation") as Promise<TPackModule>,
  "heroicons-outline": import(
    "styled-icons/heroicons-outline"
  ) as Promise<TPackModule>,
  "heroicons-solid": import(
    "styled-icons/heroicons-solid"
  ) as Promise<TPackModule>,
  icomoon: import("styled-icons/icomoon") as Promise<TPackModule>,
  "ionicons-sharp": import(
    "styled-icons/ionicons-sharp"
  ) as Promise<TPackModule>,
  "ionicons-solid": import(
    "styled-icons/ionicons-solid"
  ) as Promise<TPackModule>,
  "ionicons-outline": import(
    "styled-icons/ionicons-outline"
  ) as Promise<TPackModule>,
  material: import("styled-icons/material") as Promise<TPackModule>,
  "material-outlined": import(
    "styled-icons/material-outlined"
  ) as Promise<TPackModule>,
  "material-rounded": import(
    "styled-icons/material-rounded"
  ) as Promise<TPackModule>,
  "material-sharp": import(
    "styled-icons/material-sharp"
  ) as Promise<TPackModule>,
  "material-twotone": import(
    "styled-icons/material-twotone"
  ) as Promise<TPackModule>,
  "open-iconic": import("styled-icons/open-iconic") as Promise<TPackModule>,
  octicons: import("styled-icons/octicons") as Promise<TPackModule>,
  "remix-fill": import("styled-icons/remix-fill") as Promise<TPackModule>,
  "remix-editor": import("styled-icons/remix-editor") as Promise<TPackModule>,
  "remix-line": import("styled-icons/remix-line") as Promise<TPackModule>,
  "simple-icons": import("styled-icons/simple-icons") as Promise<TPackModule>,
  typicons: import("styled-icons/typicons") as Promise<TPackModule>,
  zondicons: import("styled-icons/zondicons") as Promise<TPackModule>,
};

function useIsMountedRef() {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);
  return ref;
}

function isStyledIcon(v: unknown): v is StyledIcon {
  // styled-icons экспортят React-компоненты (forwardRef), они функции/объекты
  return typeof v === "function" || (typeof v === "object" && v !== null);
}

type Props = {
  pack: string;
  name: string;
};

export const IconCard: React.FC<Props> = ({ name, pack }) => {
  const isMounted = useIsMountedRef();

  const [copied, setCopied] = useState(false);
  const [Icon, setIcon] = useState<StyledIcon | null>(null);

  const iconImport = useMemo(
    () => `@styled-icons/${pack}/${name}`,
    [pack, name],
  );

  const copyCallback = useCallback(() => {
    copy(iconImport);
    setCopied(true);

    window.setTimeout(() => {
      if (isMounted.current) setCopied(false);
    }, 1200);
  }, [iconImport, isMounted]);

  useEffect(() => {
    let cancelled = false;

    const loader = importMap[pack];
    if (!loader) {
      setIcon(null);
      return;
    }

    loader
      .then((mod) => {
        if (cancelled || !isMounted.current) return;

        const candidate = mod[name];
        setIcon(isStyledIcon(candidate) ? (candidate as StyledIcon) : null);
      })
      .catch(() => {
        if (cancelled || !isMounted.current) return;
        setIcon(null);
      });

    return () => {
      cancelled = true;
    };
  }, [name, pack, isMounted]);

  return (
    <div
      className="icon-card"
      onClick={copyCallback}
      role="button"
      tabIndex={0}
    >
      <div>{Icon ? <Icon size="48" title={`${name} icon`} /> : null}</div>
      <div className="name">{name}</div>
      <code>{copied ? "Copied!" : iconImport}</code>
    </div>
  );
};
