import { useEffect, useRef, useState } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';

import { useTextField } from 'react-aria'

import { 
  Label, 
  Description 
} from '../../base'



const ProseMirror = (props) => {
  const editorRef = useRef(null);
  const [value, setValue] = useState(props.value);

  const {
    labelProps,
    inputProps,
    descriptionProps,
  } = useTextField(props, editorRef)

  useEffect(() => {
    // Update local state when props.value changes
    setValue(props.value);
  }, [props.value]);

  useEffect(() => props.onChange && props.onChange(value), [value]);

  useEffect(() => {

    const editorWrapper = document.createElement('div');
    editorWrapper.id = 'editor';

    const contentDiv = document.createElement('div');
    contentDiv.id = 'content';


    const paragraph = document.createElement('p');
    paragraph.innerHTML = value; // Set the default content here
    contentDiv.appendChild(paragraph);

    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks
    });

    

    const plugins = exampleSetup({ schema: mySchema });
    const doc = DOMParser.fromSchema(mySchema).parse(contentDiv);
    const state = EditorState.create({ doc: doc, plugins: plugins });
    const editorView = new EditorView(editorRef.current, { state: state });

    console.log(editorView)

    // Output and Rendered
    const outputElement = document.getElementById("output");
    const renderedElement = document.getElementById("rendered");

    editorView.dom.addEventListener("input", () => {
      
      const content = JSON.stringify(editorView.state.doc.toJSON(), null, 2);
      outputElement.textContent = content;

      const rendered = editorView.dom.innerHTML;
      renderedElement.innerHTML = rendered;
      setValue(rendered);

    });

    editorView.dom.addEventListener("DOMNodeInserted", () => {
      const content = JSON.stringify(editorView.state.doc.toJSON(), null, 2);
      outputElement.textContent = content;

      const rendered = editorView.dom.innerHTML;
      setValue(rendered);

    });


    return () => editorView.destroy();
  }, []);


  return (
    <div className="tf-editor">
      {props.label &&
          <Label {...labelProps}>
            {props.label}
          </Label>}
      <input type="hidden" name={props.name} value={value} />
      <div ref={editorRef} />
      {props.description &&
          <Description {...descriptionProps}>
            {props.description}
          </Description>}
      <div>
        <h2>Output</h2>
        <div id="output" name></div>
      </div>
      <hr />
      <div>
        <h2>Rendered</h2>
        <div id="rendered"></div>
      </div>
    </div>
  );

};

export default ProseMirror;

