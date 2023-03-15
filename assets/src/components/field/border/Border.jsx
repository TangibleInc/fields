import { useState, useEffect, useRef } from "react";

import { useField } from "react-aria";
import { useColorFieldState } from "@react-stately/color";

import { Label, Description, Popover } from "../../base";
import Dimensions from "../dimensions/Dimensions";
import Color from "../color/Color";
import { initJSON } from "../../../utils";

const Border = (props) => {
  const units = props.units ?? ["px"];
  const format = props.format ?? "hex";

  const { labelProps, descriptionProps } = useField(props);

  const [value, setValue] = useState(
    initJSON(props.value ?? "", {
      dimensions: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        unit: units[0],
        isLinked: false,
      },
      colorValue: useColorFieldState(props)
    })
  );

  return (
    <div>
      {props.label && <Label {...labelProps}>{props.label}</Label>}
      <div className="dimension-container">
        <Dimensions linked={props.linked} value={value.dimensions} units={units}/>
      </div>
      <div className="color-container">
        <Color
          value={value.colorValue.colorValue ?? 'rgba(0,0,0,1)'}
          format={format}
          hasAlpha={props.hasAlpha ?? true}
        />
      </div>
      {props.description && (
        <Description {...descriptionProps}>{props.description}</Description>
      )}
    </div>
  );
};

export default Border;
