import { GraphQLServer } from 'graphql-yoga';

// Scalar types = String, Boolean, Int, Float, ID
const users = [{
    id:'1',
    name: 'Terry',
    email:'terry@gmail.com',
    age: 30
},{
    id:'2',
    name: 'Rayn',
    email:'rayn@gmail.com',
    age: 27
}]

//Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        me: User!
        post: Post!
        users(query: String):[User!]!
    }

    type User {
        id: ID!
        name: String!
        email:String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`
//Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            if(args.name)
                return `Hello! + ${args.name}!`
            else
                return 'Hello';
        },
        me() {
            return {
                id: '123923',
                name: 'Terry',
                email: 'terry@gmail.com',
                age: 20
            }
        },
        post() {
            return {
                id: '232',
                title: 'GraphQL 101',
                body: '',
                published: false
            }
        },
        users(parent, args, ctx, info) {
            if(!args.query) {
                return users;
            } 

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=> {
    console.log('The server is up!')
})