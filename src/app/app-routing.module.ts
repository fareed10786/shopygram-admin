import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },

  {
    path: 'orders/details/:id',
    loadChildren: () => import('./pages/orders/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'products/details/:id',
    loadChildren: () => import('./pages/products/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'users/admin',
    loadChildren: () => import('./pages/sub-admin/sub-admin.module').then( m => m.SubAdminPageModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./pages/posts/posts.module').then( m => m.PostsPageModule)
  },
  {
    path: 'featured',
    loadChildren: () => import('./pages/posts/featured/featured.module').then( m => m.FeaturedPageModule)
  },
  {
    path: 'posts/details/:id',
    loadChildren: () => import('./pages/posts/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'sellers',
    loadChildren: () => import('./pages/sellers/sellers.module').then( m => m.SellersPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'roles',
    loadChildren: () => import('./pages/roles/roles.module').then( m => m.RolesPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  },
  {
    path: 'sizes',
    loadChildren: () => import('./pages/sizes/sizes.module').then( m => m.SizesPageModule)
  },
  {
    path: 'brands',
    loadChildren: () => import('./pages/brand/brand.module').then( m => m.BrandPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  },

  {
    path: 'sg-admin/home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
 

  {
    path: 'sg-admin/login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'sg-admin/orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },

  {
    path: 'sg-admin/orders/details/:id',
    loadChildren: () => import('./pages/orders/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'sg-admin/products/details/:id',
    loadChildren: () => import('./pages/products/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'sg-admin/users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'sg-admin/users/admin',
    loadChildren: () => import('./pages/sub-admin/sub-admin.module').then( m => m.SubAdminPageModule)
  },
  {
    path: 'sg-admin/posts',
    loadChildren: () => import('./pages/posts/posts.module').then( m => m.PostsPageModule)
  },
  {
    path: 'sg-admin/featured',
    loadChildren: () => import('./pages/posts/featured/featured.module').then( m => m.FeaturedPageModule)
  },
  {
    path: 'sg-admin/posts/details/:id',
    loadChildren: () => import('./pages/posts/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'sg-admin/products',
    loadChildren: () => import('./pages/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'sg-admin/sellers',
    loadChildren: () => import('./pages/sellers/sellers.module').then( m => m.SellersPageModule)
  },
  {
    path: 'sg-admin/categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'sg-admin/dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'sg-admin/roles',
    loadChildren: () => import('./pages/roles/roles.module').then( m => m.RolesPageModule)
  },
  {
    path: 'sg-admin/pages',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  },
  {
    path: 'sg-admin/sizes',
    loadChildren: () => import('./pages/sizes/sizes.module').then( m => m.SizesPageModule)
  },
  {
    path: 'sg-admin/brands',
    loadChildren: () => import('./pages/brand/brand.module').then( m => m.BrandPageModule)
  },
  {
    path: 'sg-admin/payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
