// schema.js

// Require the graphql package (1)
// Use object destructuring to extract the necessary classes from the graphql object
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = require('graphql');

//TaskType (1)
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString }
  }
});

//RootQuery (2)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: {id: { type: GraphQLString } },
      resolve(parent, args) {
        //resolve data
      }
    }
  }
});

// Export the TaskType object so it can be used in other parts of your application
module.exports = new GraphQLSchema({
  query: TaskType
});
