
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
      { path: '/submission_type/create', component: () => import('pages/submission_type'), name: 'create_submission_type' }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
