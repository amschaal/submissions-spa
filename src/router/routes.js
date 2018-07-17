
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
      { path: '/submissions/create', component: () => import('pages/forms/submission'), name: 'create_submission' }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
