import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import axios from 'axios';
import Main from './Main';

jest.mock('axios');

// const events = [
//   {
//     name: 'Test Event 1',
//     startDate: '2020-01-24T04:38:27.940Z',
//     endDate: '2020-01-28T04:38:27.940Z',
//     place: 'random place',
//     description: 'A test event',
//   },
//   {
//     name: 'Test Event 2',
//     startDate: '2020-01-25T04:38:27.940Z',
//     endDate: '2020-01-29T04:38:27.940Z',
//     place: 'New random place',
//     description: 'A test event with differnt name and times',
//   },
// ]

configure({ adapter: new Adapter() });

describe('<Main /> landing page', () => {
  let component;
  beforeEach(() => {
    component = shallow(<Main />, { disableLifecycleMethods: true });
  });

  test('Main page displays events', () => {
    const eventsContainers = component.find('EventsContainer');
    expect(eventsContainers).toHaveLength(1);
  });

  test('Main page does not initially display menu options', () => {
    expect(component.state('menu')).toBe(false);
    expect(component.find('NavLink')).toHaveLength(1);
  });

  test('Main page does not initially display Sign In/ Sign Up cmpnts', () => {
    expect(component.state('signUp')).toBe(false);
    expect(component.find('SignUp')).toHaveLength(0);
    expect(component.find('Login')).toHaveLength(0);
  });

  test('Main page does not initially display events editor cmpnt', () => {
    expect(component.state('editor')).toBe(false);
    expect(component.find('EventEditor')).toHaveLength(0);
  });

  test('Main page does not initially display adminList cmpnt', () => {
    expect(component.state('editor')).toBe(false);
    expect(component.find('AdminList')).toHaveLength(0);
  });
});

describe('Main Page Menu Interactions when not logged in', () => {
  let component;
  beforeEach(() => {
    component = shallow(<Main />, { disableLifecycleMethods: true });
  });

  test('Main page displays menu options click menu', () => {
    component.find('NavLink').simulate('click');
    expect(component.state('menu')).toBe(true);
    expect(component.find('NavLink')).toHaveLength(2);
  });
  test('Main page displays sign in as only option', () => {
    component.find('NavLink').simulate('click');
    expect(component.find('NavLink').at(1).text()).toBe('Sign In');
  });

  test('Main page displays Sign In as only menu option when logged out', () => {
    component.setState({ menu: true });
    expect(component.find('NavLink')).toHaveLength(2);
    expect(component.find('NavLink').at(1).text()).toBe('Sign In');
  });

  test('Main page displays signin/login cmpnt on click sign in', () => {
    component.find('NavLink').simulate('click');
    component.find('NavLink[children="Sign In"]').simulate('click');
    expect(component.state('menu')).toBe(false);
    expect(component.find('SignUp')).toHaveLength(1);
    expect(component.find('Login')).toHaveLength(1);
  });
});


describe('Main Page Menu Interactions when logged in as non admin', () => {
  let component;
  beforeEach(() => {
    component = shallow(<Main />, { disableLifecycleMethods: true });
    component.setState({ token: 'r4nd0mt0k3n' });
  });

  test('Main page displays logout on click menu when logged in', () => {
    component.find('NavLink').simulate('click');
    const navlinks = component.find('NavLink');
    expect(navlinks.length).toBeGreaterThanOrEqual(2);
    expect(navlinks.last().text()).toBe('LogOut');
  });

  test('Main page logout user on click logout', () => {
    // const getSpy = jest.spyOn(axios, 'delete');
    axios.delete.mockResolvedValue({ data: { success: true, message: 'deleted!' } });
    component.find('NavLink').simulate('click');
    component.find('NavLink[children="LogOut"]').simulate('click');
    // expect(getSpy).toBeCalled();
    expect(component.state('menu')).toBe(false);
    setTimeout(() => {
      expect(component.state('token')).toBe('');
    }, 0.1);
  });
});

describe('Main Page Menu Interactions when logged in as admin', () => {
  let component;
  beforeEach(() => {
    component = shallow(<Main />, { disableLifecycleMethods: true });
    component.setState({ token: 'r4nd0mt0k3n', admin: true });
  });

  test('Main page displays options on click menu when admin logged in', () => {
    component.find('NavLink').simulate('click');
    const navlinks = component.find('NavLink');
    expect(navlinks.length).toBeGreaterThanOrEqual(4);
    expect(navlinks.last().text()).toBe('LogOut');
  });

  test('Main page displays event editor conpmonent on click new event', () => {
    component.find('NavLink').simulate('click');
    component.find('NavLink[children="New Event"]').simulate('click');
    expect(component.state('menu')).toBe(false);
    expect(component.find('EventEditor')).toHaveLength(1);
  });

  test('Main page displays admin list conpmonent on click Change Admin', () => {
    component.find('NavLink').simulate('click');
    component.find('NavLink[children="Change Admin"]').simulate('click');
    expect(component.state('changeAdmin')).toBe(true);
    expect(component.find('AdminList')).toHaveLength(1);
  });

  test('Main page logout user on click logout', () => {
    axios.delete.mockResolvedValue({ data: { success: true, message: 'deleted!' } });
    component.find('NavLink').simulate('click');
    component.find('NavLink[children="LogOut"]').simulate('click');
    expect(component.state('menu')).toBe(false);
    setTimeout(() => {
      expect(component.state('token')).toBe('');
    }, 0.1);
  });
});
