import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App';

configure({ adapter: new Adapter() });

describe('<App />', () => {
  test('has 1 child: Router', () => {
    const tree = shallow(<App />);
    expect(tree.children.length).toBe(1);
  });
});
