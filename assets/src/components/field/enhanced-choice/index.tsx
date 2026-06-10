import MultipleChoices from "./MultipleChoices";
import SingleChoices from "./SingleChoices";
import { getOptions } from '../../../utils'
import { RenderChoices } from '../../base'

import './index.scss'

export default (props) => {
  console.log('EnhancedChoice props:', props);
  const items = getOptions(props.choices ?? {});
  return props.multiple
    ? <MultipleChoices {...props} items={items} />
    : <SingleChoices  {...props} items={items} />;
};
