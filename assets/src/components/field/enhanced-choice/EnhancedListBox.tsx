import { useListBox } from "react-aria"; // FIX — useListBox was used but never imported
import EnhancedOption from "./EnhancedOption";

const EnhancedListBox = ({ listBoxRef, state, name, pendingKey, ...props }) => {

  const { listBoxProps } = useListBox(props, state, listBoxRef);

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
                  isPending={pendingKey === child.key}
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
            isPending={pendingKey === item.key}
            isVisibilityEnabled={props.isVisibilityEnabled}
            onToggleVisibility={props.onToggleVisibility}
          />
        )
      )}
    </ul>
  );
};

export default EnhancedListBox;
