import Label from './Label.jsx';
import Description from './Description.jsx';

export default {
  title: 'Field/Label and Description',
  tags: ['autodocs'],
};

export const Basic = () => {
  const parent = {
    name: 'test-field',
    labelVisuallyHidden: false,
    descriptionVisuallyHidden: false,
  };

  return (
    <div className="tf-field">
      <Label parent={parent}>Label text</Label>
      <Description parent={parent}>Helpful description text</Description>
    </div>
  );
};