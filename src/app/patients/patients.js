angular.module( 'orangeClinical.patients', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'orangeClinical.auth',
  'ngResource'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'patients', {
    url: '/patients',
    views: {
      'main': {
        controller: 'PatientsCtrl',
        templateUrl: 'patients/patients.tpl.html'
      }
    },
    data:{ pageTitle: 'Patients' }
  })
  .state( 'patients.detail', {
    url: '/:id',
    views: {
      'main@': {
        controller: 'PatientCtrl',
        templateUrl: 'patients/patient.tpl.html'
      }
    }
  })
  ;
})

// patients data factory from API
.factory( 'Patients', function( api, $resource ) {
  return $resource(api.BASE + '/patients/:id', null, {
    query: {
      isArray: false
    }
  });
})

// patients list controller
.controller( 'PatientsCtrl', function PatientsController( $scope, Patients ) {
  // get all patients
  $scope.patients = [];
  $scope.patientsCount = 0;
  $scope.$watch("currentPage", function (newPage) {
    Patients.query({
      limit: $scope.patientsPerPage,
      // 0-indexing
      offset: (newPage - 1) * $scope.patientsPerPage
    }, function (res) {
      $scope.patients = res.patients;
      $scope.patientsCount = res.count;
    });
  });

  // pagination
  $scope.currentPage = 1;
  $scope.patientsPerPage = 5;
})

// single patient detail view controller
.controller( 'PatientCtrl', function PatientController( $scope, $stateParams, Patients ) {
  // get Patient
  $scope.patient = Patients.get({id: $stateParams.id});
})

;
