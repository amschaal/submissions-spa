
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') },
      {
        path: '/submissions',
        component: () => import('pages/submissions'),
        name: 'submissions'
      },
      { path: '/submissions/create', component: () => import('pages/forms/submission'), name: 'create_submission' },
      {
        path: '/submission_types',
        component: () => import('pages/submission_types'),
        name: 'submission_types'
      },
      {
        path: '/submission_type/:id',
        component: () => import('pages/forms/submission_type'),
        name: 'submission_type',
        props: true
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
