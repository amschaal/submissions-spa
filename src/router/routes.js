
export default [
  {
    path: '/',
    component: () => import('layouts/base'),
    children: [
      { path: '', name: 'index', component: () => import('pages/index') },
      {
        path: '/submissions',
        component: () => import('pages/submissions'),
        name: 'submissions'
      },
      { path: '/submissions/create',
        component: () => import('pages/submission'),
        name: 'create_submission',
        props: {create: true, id: null}
      },
      {
        path: '/submissions/:id',
        component: () => import('pages/submission'),
        name: 'submission',
        props: true
      },
      {
        path: '/submissions/:id/modify/',
        component: () => import('pages/submission'),
        name: 'modify_submission',
        props: (route) => ({ id: route.params.id, modify: true })
      },
      {
        path: '/submissions/:id/confirm/',
        component: () => import('pages/confirm_submission'),
        name: 'confirm_submission',
        props: (route) => ({ id: route.params.id })
      },
      {
        path: '/submissions/created/',
        component: () => import('pages/submission_created'),
        name: 'submission_created'
      },
      {
        path: '/submission_types',
        component: () => import('pages/submission_types'),
        name: 'submission_types'
      },
      {
        path: '/submission_type/:id',
        component: () => import('pages/submission_type'),
        name: 'submission_type',
        props: true
      },
      { path: '/submission_type/create', component: () => import('pages/submission_type'), name: 'create_submission_type' },
      { path: '/settings', name: 'settings', component: () => import('pages/settings') }
    ]
  },
  {
    path: '/print',
    component: () => import('layouts/blank'),
    children: [
      {
        path: '/print/submissions/:id',
        component: () => import('pages/print_submission'),
        name: 'print_submission',
        props: (route) => ({ id: route.params.id })
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
