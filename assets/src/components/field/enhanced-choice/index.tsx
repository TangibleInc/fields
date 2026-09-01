import MultipleChoices from "./MultipleChoices";
import SingleChoices from "./SingleChoices";
import { getOptions } from '../../../utils'

export default (props) => {
  const items = getOptions(props.choices ?? {});
  return props.multiple
    ? <MultipleChoices {...props} items={items} />
    : <SingleChoices  {...props} items={items} />;
};
