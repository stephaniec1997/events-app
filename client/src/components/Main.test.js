import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Main from './Main';

const events = [
  {
    name: 'Test Event 1',
    startDate: '2020-01-24T04:38:27.940Z',
    endDate: '2020-01-28T04:38:27.940Z',
    place: 'random place',
    description: 'A test event',
  },
  {
    name: 'Test Event 2',
    startDate: '2020-01-25T04:38:27.940Z',
    endDate: '2020-01-29T04:38:27.940Z',
    place: 'New random place',
    description: 'A test event with differnt name and times',
  },
]

configure({ adapter: new Adapter() });

describe('<Main />', () => {

  test('Main page displays events', () =>{
    const component = shallow(<Main
      />, { disableLifecycleMethods: true });
      component.setState({collection: events})
      const eventsContainers = component.find('EventsContainer');
      expect(eventsContainers).toHaveLength(1);
  })

  test('Main page displays sign in on click menu', () =>{
    const component = shallow(<Main
      />, { disableLifecycleMethods: true });
      component.setState({collection: events})
      expect(component.find('NavLink')).toHaveLength(1);
      component.find('NavLink').simulate('click');
      expect(component.state('menu')).toBe(true);
      expect(component.find('NavLink')).toHaveLength(2);
      expect(component.find('NavLink').at(1).text()).toBe('Sign In');
  })

  test('Main page displays signin/login conpmonent on click sign in', () =>{
    const component = shallow(<Main
      />, { disableLifecycleMethods: true });
      component.setState({collection: events})
      expect(component.find('EventsContainer')).toHaveLength(1);
      expect(component.find('SignUp')).toHaveLength(0);
      expect(component.find('Login')).toHaveLength(0);
      component.find('NavLink').simulate('click');
      expect(component.state('menu')).toBe(true);
      expect(component.state('signUp')).toBe(false);
      component.find('NavLink[children="Sign In"]').simulate('click');
      expect(component.state('menu')).toBe(false);
      expect(component.state('signUp')).toBe(true);
      expect(component.find('SignUp')).toHaveLength(1);
      expect(component.find('Login')).toHaveLength(1);
  })

  test('Main page displays logout on click menu when logged in', () =>{
    const component = shallow(<Main
      />, { disableLifecycleMethods: true });
      component.setState({collection: events, token: '12345j32124'})
      expect(component.find('NavLink')).toHaveLength(1);
      component.find('NavLink').simulate('click');
      expect(component.state('menu')).toBe(true);
      const navlinks = component.find('NavLink');
      expect(navlinks.length).toBeGreaterThanOrEqual(2);
      expect(navlinks.last().text()).toBe('LogOut');

  })

  test('Main page displays options (logout) on click menu when admin logged in', () =>{
    const component = shallow(<Main
      />, { disableLifecycleMethods: true });
      component.setState({collection: events, token: '12345j32124', admin: true})
      expect(component.find('NavLink')).toHaveLength(1);
      component.find('NavLink').simulate('click');
      expect(component.state('menu')).toBe(true);
      const navlinks = component.find('NavLink');
      expect(navlinks.length).toBeGreaterThanOrEqual(4);
      expect(navlinks.last().text()).toBe('LogOut');

  })
  test('Main page displays signin/login conpmonent on click sign in', () =>{
    const component = shallow(<Main
      />, { disableLifecycleMethods: true });
      component.setState({collection: events, token: '12345j32124', admin: true})
      expect(component.find('EventsContainer')).toHaveLength(1);
      expect(component.find('EvenEditor')).toHaveLength(0);
      component.find('NavLink').simulate('click');
      expect(component.state('menu')).toBe(true);
      expect(component.state('editor')).toBe(false);
      component.find('NavLink[children="New Event"]').simulate('click');
      expect(component.state('menu')).toBe(false);
      expect(component.state('editor')).toBe(true);
      expect(component.find('EventEditor')).toHaveLength(1);
  })

  test('Main page displays signin/login conpmonent on click sign in', () =>{
    const component = shallow(<Main
      />, { disableLifecycleMethods: true });
      component.setState({collection: events, token: '12345j32124', admin: true, event:null})
      expect(component.find('EventsContainer')).toHaveLength(1);
      expect(component.find('AdminList')).toHaveLength(0);
      component.find('NavLink').simulate('click');
      expect(component.state('menu')).toBe(true);
      expect(component.state('changeAdmin')).toBe(false);
      component.find('NavLink[children="Change Admin"]').simulate('click');
      expect(component.state('menu')).toBe(false);
      expect(component.state('changeAdmin')).toBe(true);
      expect(component.find('AdminList')).toHaveLength(1);
  })
  //https://medium.com/better-programming/testing-react-list-using-axios-and-react-testing-library-d000eebf3413
});
