import type { FC, ComponentType } from "react";

interface DoubleClickProps {
  onSingleClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
}

const withDoubleClick = <P extends DoubleClickProps>(
  WrappedComponent: ComponentType<P>
): FC<P> => {
  const WithDoubleClick: FC<P> = (props: P) => {
    let timer: NodeJS.Timeout | null = null;
    const handleClick = (e: React.MouseEvent): void => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        props.onDoubleClick(e);
      } else {
        timer = setTimeout(() => {
          timer = null;
          props.onSingleClick(e);
        }, 300);
      }
    };
    return <WrappedComponent onClick={handleClick} {...props} />;
  };

  const wrappedComponentName =
    WrappedComponent.displayName != null
      ? WrappedComponent.displayName
      : WrappedComponent.name;
  WithDoubleClick.displayName = `withDoubleClick(${wrappedComponentName})`;

  return WithDoubleClick;
};

export default withDoubleClick;
