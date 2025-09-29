/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { render, screen } from 'spec/helpers/testing-library';
import Login from './index';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    search: '',
  },
  writable: true,
});

jest.mock('src/utils/getBootstrapData', () => ({
  __esModule: true,
  default: () => ({
    common: {
      conf: {
        AUTH_TYPE: 1,
        AUTH_PROVIDERS: [],
        AUTH_USER_REGISTRATION: false,
      },
    },
  }),
}));

test('should render login form elements', () => {
  render(<Login />, { useRedux: true });
  expect(screen.getByTestId('login-form')).toBeInTheDocument();
  expect(screen.getByTestId('username-input')).toBeInTheDocument();
  expect(screen.getByTestId('password-input')).toBeInTheDocument();
  expect(screen.getByTestId('login-button')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
});

test('should render username and password labels', () => {
  render(<Login />, { useRedux: true });
  expect(screen.getByText('Username:')).toBeInTheDocument();
  expect(screen.getByText('Password:')).toBeInTheDocument();
});

test('should render form instruction text', () => {
  render(<Login />, { useRedux: true });
  expect(
    screen.getByText('Enter your login and password below:'),
  ).toBeInTheDocument();
});

test('should preserve next parameter in OAuth provider URLs', () => {
  // Mock OAuth authentication type and providers
  jest.doMock('src/utils/getBootstrapData', () => ({
    __esModule: true,
    default: () => ({
      common: {
        conf: {
          AUTH_TYPE: 4, // AuthOauth
          AUTH_PROVIDERS: [{ name: 'google', icon: 'google' }],
          AUTH_USER_REGISTRATION: false,
        },
      },
    }),
  }));

  // Mock URL with next parameter
  Object.defineProperty(window, 'location', {
    value: {
      search: '?next=%2Fdashboard%2F123',
    },
    writable: true,
  });

  // Re-import the component to use the new mock
  const LoginWithOAuth = require('./index').default;
  render(<LoginWithOAuth />, { useRedux: true });
  
  const oauthButton = screen.getByRole('link', { name: /sign in with google/i });
  expect(oauthButton).toHaveAttribute('href', '/login/google?next=%2Fdashboard%2F123');
});

test('should preserve next parameter in OpenID provider URLs', () => {
  // Mock OpenID authentication type and providers
  jest.doMock('src/utils/getBootstrapData', () => ({
    __esModule: true,
    default: () => ({
      common: {
        conf: {
          AUTH_TYPE: 0, // AuthOID
          AUTH_PROVIDERS: [{ name: 'azure', url: '/login/azure' }],
          AUTH_USER_REGISTRATION: false,
        },
      },
    }),
  }));

  // Mock URL with next parameter
  Object.defineProperty(window, 'location', {
    value: {
      search: '?next=%2Fexplore%2F',
    },
    writable: true,
  });

  // Re-import the component to use the new mock
  const LoginWithOID = require('./index').default;
  render(<LoginWithOID />, { useRedux: true });
  
  const oidButton = screen.getByRole('link', { name: /sign in with azure/i });
  expect(oidButton).toHaveAttribute('href', '/login/azure?next=%2Fexplore%2F');
});

test('should handle SSO URLs without next parameter', () => {
  // Mock OAuth authentication type and providers
  jest.doMock('src/utils/getBootstrapData', () => ({
    __esModule: true,
    default: () => ({
      common: {
        conf: {
          AUTH_TYPE: 4, // AuthOauth
          AUTH_PROVIDERS: [{ name: 'github', icon: 'github' }],
          AUTH_USER_REGISTRATION: false,
        },
      },
    }),
  }));

  // Mock URL without next parameter
  Object.defineProperty(window, 'location', {
    value: {
      search: '',
    },
    writable: true,
  });

  // Re-import the component to use the new mock
  const LoginWithoutNext = require('./index').default;
  render(<LoginWithoutNext />, { useRedux: true });
  
  const oauthButton = screen.getByRole('link', { name: /sign in with github/i });
  expect(oauthButton).toHaveAttribute('href', '/login/github');
});
