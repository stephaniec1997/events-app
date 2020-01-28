import React from 'react';
import App from './App';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('<App />', () => {
  test('has 1 child: Router', () => {
    const tree = shallow(<App />);
    expect(tree.children.length).toBe(1);
  });
});
