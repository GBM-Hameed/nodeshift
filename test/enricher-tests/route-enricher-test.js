'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');

test('Route enricher - route resource', (t) => {
  const config = {
    projectName: 'Project Name',
    version: '1.0.0'
  };

  const routeEnricher = proxyquire('../../lib/resource-enrichers/route-enricher', {
    '../definitions/route-spec': () => {
      t.fail('this should not be hit');
    }
  });
  const resourceList = [
    {
      kind: 'Service',
      metadata: {
        name: 'service meta'
      }
    }
  ];

  t.ok(routeEnricher.enrich, 'has an enrich property');
  t.equal(typeof routeEnricher.enrich, 'function', 'is a function');
  t.ok(routeEnricher.name, 'has an name property');
  t.equal(routeEnricher.name, 'route', 'name property is route');

  const p = routeEnricher.enrich(config, resourceList);
  t.ok(p instanceof Promise, 'enricher should return a promise');

  p.then((re) => {
    t.equal(Array.isArray(re), true, 'should return an array');
    t.notEqual(re, resourceList, 'arrays should not be equal');
    t.end();
  });
});

test('Route enricher - no route resource', async (t) => {
  const config = {
    projectName: 'Project Name',
    version: '1.0.0'
  };

  const routeEnricher = proxyquire('../../lib/resource-enrichers/route-enricher', {
    '../definitions/route-spec': () => {}
  });
  const resourceList = [
    {
      kind: 'Service',
      metadata: {
        name: 'service meta'
      }
    },
    {
      kind: 'Route',
      metadata: {
        name: 'route name'
      }
    }
  ];

  const re = await routeEnricher.enrich(config, resourceList);

  t.equal(Array.isArray(re), true, 'should return an array');
  t.notEqual(re, resourceList, 'arrays should not be equal');
  t.ok(re[1].spec, 'spec should exist');
  t.end();
});

test('Route enricher - no route resource - using expose', (t) => {
  const config = {
    projectName: 'Project Name',
    version: '1.0.0',
    expose: true
  };

  const routeEnricher = proxyquire('../../lib/resource-enrichers/route-enricher', {
    '../definitions/route-spec': () => {
      t.pass('this should be hit');
    }
  });
  const resourceList = [
    {
      kind: 'Service',
      metadata: {
        name: 'service meta'
      }
    }
  ];

  t.ok(routeEnricher.enrich, 'has an enrich property');
  t.equal(typeof routeEnricher.enrich, 'function', 'is a function');
  t.ok(routeEnricher.name, 'has an name property');
  t.equal(routeEnricher.name, 'route', 'name property is route');

  const p = routeEnricher.enrich(config, resourceList);
  t.ok(p instanceof Promise, 'enricher should return a promise');

  p.then((re) => {
    t.equal(Array.isArray(re), true, 'should return an array');
    t.equal(re, resourceList, 'arrays should not be equal');
    t.ok(re[1].spec, 'spec should exist');
    t.equal(re[1].kind, 'Route', 'should have created a route');
    t.end();
  });
});
