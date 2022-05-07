import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Category = {
  __typename?: 'Category';
  _id: Scalars['String'];
  category: Scalars['String'];
};

export type Error = {
  __typename?: 'Error';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCategory?: Maybe<Category>;
  authorisation?: Maybe<Response>;
  changePassword: Response;
  createPost: Post;
  deleteCategory: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  forgotPassword: Response;
  logout: Scalars['Boolean'];
  registration: Response;
  unvote: Scalars['Boolean'];
  updatePost?: Maybe<Post>;
  vote: Scalars['Boolean'];
};


export type MutationAddCategoryArgs = {
  name: Scalars['String'];
};


export type MutationAuthorisationArgs = {
  options: UserAuthInput;
};


export type MutationChangePasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreatePostArgs = {
  categoryId?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  text: Scalars['String'];
  title: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
  _id: Scalars['String'];
};


export type MutationDeletePostArgs = {
  _id: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegistrationArgs = {
  options: UserInput;
};


export type MutationUnvoteArgs = {
  postId: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  _id: Scalars['String'];
  categoryId?: InputMaybe<Scalars['String']>;
  imageURL?: InputMaybe<Scalars['String']>;
  text?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};


export type MutationVoteArgs = {
  postId: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['String'];
  categoryId?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  imageURL: Scalars['String'];
  points: Scalars['Float'];
  text: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
  userId: Scalars['String'];
  voteStatus?: Maybe<Scalars['Float']>;
};

export type PostResponse = {
  __typename?: 'PostResponse';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Query = {
  __typename?: 'Query';
  checkAuth?: Maybe<Response>;
  getAnswer: Array<Category>;
  getCategories: Array<Category>;
  getMyId?: Maybe<Scalars['String']>;
  getOneCategory?: Maybe<Category>;
  getOnePost?: Maybe<Post>;
  getPosts: PostResponse;
  getPostsByName: PostResponse;
  sort: PostResponse;
};


export type QueryGetOneCategoryArgs = {
  categoryId: Scalars['String'];
};


export type QueryGetOnePostArgs = {
  _id: Scalars['String'];
};


export type QueryGetPostsArgs = {
  _id?: InputMaybe<Scalars['String']>;
  categoryId?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryGetPostsByNameArgs = {
  _id?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
};


export type QuerySortArgs = {
  categoryId?: InputMaybe<Scalars['String']>;
};

export type Response = {
  __typename?: 'Response';
  error?: Maybe<Array<Error>>;
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['String'];
  createdAt: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  posts: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserAuthInput = {
  password: Scalars['String'];
  usernameORemail: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type RegularUserFragment = { __typename?: 'User', _id: string, username: string };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'Response', error?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'User', _id: string, username: string } | null } };

export type CheckAuthQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckAuthQuery = { __typename?: 'Query', checkAuth?: { __typename?: 'Response', user?: { __typename?: 'User', _id: string, username: string } | null, error?: Array<{ __typename?: 'Error', field: string, message: string }> | null } | null };

export type CreatePostMutationVariables = Exact<{
  title: Scalars['String'];
  text: Scalars['String'];
  categoryId: Scalars['String'];
  imageUrl: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', _id: string, title: string, text: string, createdAt: string, points: number, categoryId?: string | null, imageURL: string, user: { __typename?: 'User', _id: string, username: string } } };

export type DeletePostMutationVariables = Exact<{
  _id: Scalars['String'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'Response', user?: { __typename?: 'User', email?: string | null } | null, error?: Array<{ __typename?: 'Error', field: string, message: string }> | null } };

export type AuthorisationMutationVariables = Exact<{
  usernameORemail: Scalars['String'];
  password: Scalars['String'];
}>;


export type AuthorisationMutation = { __typename?: 'Mutation', authorisation?: { __typename?: 'Response', user?: { __typename?: 'User', _id: string, username: string } | null, error?: Array<{ __typename?: 'Error', field: string, message: string }> | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegistrationMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegistrationMutation = { __typename?: 'Mutation', registration: { __typename?: 'Response', user?: { __typename?: 'User', _id: string, username: string } | null, error?: Array<{ __typename?: 'Error', field: string, message: string }> | null } };

export type UnVoteMutationVariables = Exact<{
  postId: Scalars['String'];
}>;


export type UnVoteMutation = { __typename?: 'Mutation', unvote: boolean };

export type UpdatePostMutationVariables = Exact<{
  _id: Scalars['String'];
  title: Scalars['String'];
  text: Scalars['String'];
  categoryId: Scalars['String'];
  imageURL: Scalars['String'];
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'Post', _id: string, title: string, text: string, userId: string, createdAt: string, categoryId?: string | null, points: number, voteStatus?: number | null, user: { __typename?: 'User', _id: string, username: string, email?: string | null } } | null };

export type VoteMutationVariables = Exact<{
  postId: Scalars['String'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type GetAllPostsByNameQueryQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
}>;


export type GetAllPostsByNameQueryQuery = { __typename?: 'Query', getPostsByName: { __typename?: 'PostResponse', hasMore: boolean, posts: Array<{ __typename?: 'Post', _id: string, title: string, text: string, userId: string, createdAt: string, imageURL: string, categoryId?: string | null, points: number, voteStatus?: number | null, user: { __typename?: 'User', _id: string, username: string, email?: string | null } }> } };

export type SortByCategoryQueryVariables = Exact<{
  categoryId: Scalars['String'];
}>;


export type SortByCategoryQuery = { __typename?: 'Query', sort: { __typename?: 'PostResponse', hasMore: boolean, posts: Array<{ __typename?: 'Post', _id: string, title: string, text: string, userId: string, createdAt: string, categoryId?: string | null, imageURL: string, points: number, voteStatus?: number | null, user: { __typename?: 'User', _id: string, username: string, email?: string | null } }> } };

export type GetOneCategoryQueryVariables = Exact<{
  categoryId: Scalars['String'];
}>;


export type GetOneCategoryQuery = { __typename?: 'Query', getOneCategory?: { __typename?: 'Category', _id: string, category: string } | null };

export type GetAllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCategoriesQuery = { __typename?: 'Query', getCategories: Array<{ __typename?: 'Category', _id: string, category: string }> };

export type GetAllPostsQueryQueryVariables = Exact<{
  _id?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  categoryId?: InputMaybe<Scalars['String']>;
}>;


export type GetAllPostsQueryQuery = { __typename?: 'Query', getPosts: { __typename?: 'PostResponse', hasMore: boolean, posts: Array<{ __typename?: 'Post', _id: string, title: string, text: string, userId: string, createdAt: string, categoryId?: string | null, imageURL: string, points: number, voteStatus?: number | null, user: { __typename?: 'User', _id: string, username: string, email?: string | null } }> } };

export type GetOnePostQueryVariables = Exact<{
  _id: Scalars['String'];
}>;


export type GetOnePostQuery = { __typename?: 'Query', getOnePost?: { __typename?: 'Post', _id: string, title: string, text: string, userId: string, createdAt: string, categoryId?: string | null, imageURL: string, points: number, voteStatus?: number | null, user: { __typename?: 'User', _id: string, username: string, email?: string | null, posts: string } } | null };

export type GetMyIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyIdQuery = { __typename?: 'Query', checkAuth?: { __typename?: 'Response', user?: { __typename?: 'User', _id: string } | null } | null };

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  _id
  username
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $password: String!) {
  changePassword(token: $token, password: $password) {
    error {
      field
      message
    }
    user {
      _id
      username
    }
  }
}
    `;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CheckAuthDocument = gql`
    query CheckAuth {
  checkAuth {
    user {
      ...RegularUser
    }
    error {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useCheckAuthQuery(options?: Omit<Urql.UseQueryArgs<CheckAuthQueryVariables>, 'query'>) {
  return Urql.useQuery<CheckAuthQuery>({ query: CheckAuthDocument, ...options });
};
export const CreatePostDocument = gql`
    mutation CreatePost($title: String!, $text: String!, $categoryId: String!, $imageUrl: String!) {
  createPost(
    title: $title
    text: $text
    categoryId: $categoryId
    imageUrl: $imageUrl
  ) {
    _id
    title
    text
    createdAt
    points
    categoryId
    imageURL
    user {
      _id
      username
    }
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($_id: String!) {
  deletePost(_id: $_id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    user {
      email
    }
    error {
      field
      message
    }
  }
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const AuthorisationDocument = gql`
    mutation Authorisation($usernameORemail: String!, $password: String!) {
  authorisation(options: {usernameORemail: $usernameORemail, password: $password}) {
    user {
      ...RegularUser
    }
    error {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useAuthorisationMutation() {
  return Urql.useMutation<AuthorisationMutation, AuthorisationMutationVariables>(AuthorisationDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegistrationDocument = gql`
    mutation Registration($username: String!, $email: String!, $password: String!) {
  registration(options: {username: $username, email: $email, password: $password}) {
    user {
      ...RegularUser
    }
    error {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useRegistrationMutation() {
  return Urql.useMutation<RegistrationMutation, RegistrationMutationVariables>(RegistrationDocument);
};
export const UnVoteDocument = gql`
    mutation UnVote($postId: String!) {
  unvote(postId: $postId)
}
    `;

export function useUnVoteMutation() {
  return Urql.useMutation<UnVoteMutation, UnVoteMutationVariables>(UnVoteDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($_id: String!, $title: String!, $text: String!, $categoryId: String!, $imageURL: String!) {
  updatePost(
    _id: $_id
    text: $text
    title: $title
    categoryId: $categoryId
    imageURL: $imageURL
  ) {
    _id
    title
    text
    userId
    createdAt
    categoryId
    points
    voteStatus
    user {
      _id
      username
      email
    }
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($postId: String!) {
  vote(postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const GetAllPostsByNameQueryDocument = gql`
    query GetAllPostsByNameQuery($_id: String, $limit: Int!, $name: String) {
  getPostsByName(_id: $_id, limit: $limit, name: $name) {
    posts {
      _id
      title
      text
      userId
      createdAt
      imageURL
      categoryId
      points
      voteStatus
      user {
        _id
        username
        email
      }
    }
    hasMore
  }
}
    `;

export function useGetAllPostsByNameQueryQuery(options: Omit<Urql.UseQueryArgs<GetAllPostsByNameQueryQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllPostsByNameQueryQuery>({ query: GetAllPostsByNameQueryDocument, ...options });
};
export const SortByCategoryDocument = gql`
    query SortByCategory($categoryId: String!) {
  sort(categoryId: $categoryId) {
    posts {
      _id
      title
      text
      userId
      createdAt
      categoryId
      imageURL
      points
      voteStatus
      user {
        _id
        username
        email
      }
    }
    hasMore
  }
}
    `;

export function useSortByCategoryQuery(options: Omit<Urql.UseQueryArgs<SortByCategoryQueryVariables>, 'query'>) {
  return Urql.useQuery<SortByCategoryQuery>({ query: SortByCategoryDocument, ...options });
};
export const GetOneCategoryDocument = gql`
    query GetOneCategory($categoryId: String!) {
  getOneCategory(categoryId: $categoryId) {
    _id
    category
  }
}
    `;

export function useGetOneCategoryQuery(options: Omit<Urql.UseQueryArgs<GetOneCategoryQueryVariables>, 'query'>) {
  return Urql.useQuery<GetOneCategoryQuery>({ query: GetOneCategoryDocument, ...options });
};
export const GetAllCategoriesDocument = gql`
    query GetAllCategories {
  getCategories {
    _id
    category
  }
}
    `;

export function useGetAllCategoriesQuery(options?: Omit<Urql.UseQueryArgs<GetAllCategoriesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllCategoriesQuery>({ query: GetAllCategoriesDocument, ...options });
};
export const GetAllPostsQueryDocument = gql`
    query GetAllPostsQuery($_id: String, $limit: Int!, $categoryId: String) {
  getPosts(_id: $_id, limit: $limit, categoryId: $categoryId) {
    posts {
      _id
      title
      text
      userId
      createdAt
      categoryId
      imageURL
      points
      voteStatus
      user {
        _id
        username
        email
      }
    }
    hasMore
  }
}
    `;

export function useGetAllPostsQueryQuery(options: Omit<Urql.UseQueryArgs<GetAllPostsQueryQueryVariables>, 'query'>) {
  return Urql.useQuery<GetAllPostsQueryQuery>({ query: GetAllPostsQueryDocument, ...options });
};
export const GetOnePostDocument = gql`
    query GetOnePost($_id: String!) {
  getOnePost(_id: $_id) {
    _id
    title
    text
    userId
    createdAt
    categoryId
    imageURL
    points
    voteStatus
    user {
      _id
      username
      email
      posts
    }
  }
}
    `;

export function useGetOnePostQuery(options: Omit<Urql.UseQueryArgs<GetOnePostQueryVariables>, 'query'>) {
  return Urql.useQuery<GetOnePostQuery>({ query: GetOnePostDocument, ...options });
};
export const GetMyIdDocument = gql`
    query getMyId {
  checkAuth {
    user {
      _id
    }
  }
}
    `;

export function useGetMyIdQuery(options?: Omit<Urql.UseQueryArgs<GetMyIdQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMyIdQuery>({ query: GetMyIdDocument, ...options });
};