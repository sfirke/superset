/* eslint-env node */
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

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  //tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But we're not doing that.
  CustomSidebar: [
    {
      type: 'doc',
      label: 'Introduction',
      id: 'intro',
    },
    {
      type: 'doc',
      label: 'Quickstart',
      id: 'quickstart',
    },
    {
      type: 'category',
      label: 'Installation',
      items: [
        {
          type: 'autogenerated',
          dirName: 'installation',
        },
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        {
          type: 'autogenerated',
          dirName: 'configuration',
        },
      ],
    },
    {
      type: 'category',
      label: 'Using Superset',
      items: [
        {
          type: 'autogenerated',
          dirName: 'using-superset',
        },
      ],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: [
        {
          type: 'autogenerated',
          dirName: 'contributing',
        },
      ],
    },
    {
      type: 'category',
      label: 'Security',
      items: [
        {
          type: 'autogenerated',
          dirName: 'security',
        },
      ],
    },
    {
      type: 'doc',
      label: 'FAQ',
      id: 'faq',
    },
    {
      type: 'doc',
      label: 'API',
      id: 'api',
    },
  ],
};

module.exports = sidebars;
