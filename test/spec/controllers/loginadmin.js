'use strict';

describe('Controller: LoginadminCtrl', function () {

  // load the controller's module
  beforeEach(module('scribeApp'));

  var LoginadminCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginadminCtrl = $controller('LoginadminCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(LoginadminCtrl.awesomeThings.length).toBe(3);
  });
});
