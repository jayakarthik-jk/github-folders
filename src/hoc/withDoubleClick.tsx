import type { FC, ComponentType } from "react";

interface DoubleClickProps {
  onSingleClick: () => void;
  onDoubleClick: () => void;
}

const withDoubleClick = <P extends DoubleClickProps>(
  WrappedComponent: ComponentType<P>
): FC<P> => {
  const WithDoubleClick: FC<P> = (props: P) => {
    let timer: NodeJS.Timeout | null = null;
    const handleClick = (): void => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
        props.onDoubleClick();
      } else {
        timer = setTimeout(() => {
          timer = null;
          props.onSingleClick();
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
