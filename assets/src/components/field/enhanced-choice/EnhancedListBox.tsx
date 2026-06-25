import { useListBox } from "react-aria";
import EnhancedOption from "./EnhancedOption";

const EnhancedListBox = ({ listBoxRef, state, name, pendingKey, pendingKeys, onSelectionChange, ...props }) => {

  const { listBoxProps } = useListBox(props, state, listBoxRef);

  const isPendingKey = (key) =>
    pendingKeys ? pendingKeys.includes(key) : pendingKey === key;

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      className="tf-enhanced-choice-list"
    >
      {[...state.collection].map((item) =>
        item.type === "section" ? (
          <li key={item.key}>
            <span>{item.rendered}</span>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[...item.childNodes].map((child) => (
                <EnhancedOption
                  key={child.key}
                  item={child}
                  state={state}
                  name={name}
                  isPending={isPendingKey(child.key)}
                  onSelectionChange={onSelectionChange}
                  isVisibilityEnabled={props.isVisibilityEnabled}
                  onToggleVisibility={props.onToggleVisibility}
                  visibility={props.visibility}
                />
              ))}
            </ul>
          </li>
        ) : (
          <EnhancedOption
            key={item.key}
            item={item}
            state={state}
            name={name}
            visibility={props.visibility}
            isPending={isPendingKey(item.key)}
            onSelectionChange={onSelectionChange}
            isVisibilityEnabled={props.isVisibilityEnabled}
            onToggleVisibility={props.onToggleVisibility}
          />
        )
      )}
    </ul>
  );
};

export default EnhancedListBox;
