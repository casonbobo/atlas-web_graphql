// schema.js

// Require the graphql package (1,3,5)
// Use object destructuring to extract the necessary classes from the graphql object
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList
} = require('graphql');

//Setting up Lodash and the Data to pull into my Graph (2)
const _ = require('lodash');
const mongoose = require('mongoose'); //(6)
const Project = require('../models/project'); //(7)
const Task = require('../models/task');


const tasks = [
  { id: '1', title: 'Create your first webpage', weight: 1, description: 'Create your first HTML file 0-index.html with: -Add the doctype on the first line (without any comment) -After the doctype, open and close a html tag Open your file in your browser (the page should be blank)' },
  { id: '2', title: 'Structure your webpage', weight: 1, description: 'Copy the content of 0-index.html into 1-index.html Create the head and body sections inside the html tag, create the head and body tags (empty) in this order' },
];

//projects
const projects = [
  {
    id: '1',
    title: 'Advanced HTML',
    weight: 1,
    description: 'Welcome to the Web Stack specialization. The 3 first projects will give you all basics of the Web development: HTML, CSS and Developer tools. In this project, you will learn how to use HTML tags to structure a web page. No CSS, no styling - don’t worry, the final page will be “ugly” it’s normal, it’s not the purpose of this project. Important note: details are important! lowercase vs uppercase / wrong letter… be careful!',
  },
  {
    id: '2',
    title: 'Bootstrap',
    weight: 1,
    description: 'Bootstrap is a free and open-source CSS framework directed at responsive, mobile-first front-end web development. It contains CSS and JavaScript design templates for typography, forms, buttons, navigation, and other interface components.',
  },
];


//TaskType (1,5)
const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent, args) {
        return _.find(projects, { id: parent.projectId });
      },
    }
  }
});

//ProjectType (3,5)
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    weight: { type: GraphQLInt },
    description: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return _.filter(tasks, { projectId: parent.id });
      },
    },
  },
 });
 
//RootQuery (2,3)
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    task: {
      type: TaskType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return _.filter(tasks, {id: args.id });
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return _.find(projects, {id: args.id });
      },
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return tasks;
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return projects;
      }
    }
  }
});

//Define the Mutation for project and task (7)
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  feilds: {
    addProjects: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let project = new Project({
          title: args.title,
          weight: args.weight,
          description: args.description
        });
        return project.save();
      }
    },
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        weight: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        projectId:{ type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        let task = new Task({
          title: args.title,
          weight: args.weight,
          description: args.description,
          projectId: args.projectId
        });
        return task.save();
      }
    }
  }
});

// Export the TaskType object so it can be used in other parts of your application
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
