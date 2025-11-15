import graphene
from core.models import Project, Task, CustomUser
from core.graphql.types import ProjectType, TaskType, UserType


class Query(graphene.ObjectType):

    # -----------------------
    # USER QUERIES
    # -----------------------
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.ID())

    # -----------------------
    # PROJECT QUERIES
    # -----------------------
    all_projects = graphene.List(ProjectType)
    project = graphene.Field(ProjectType, id=graphene.ID())

    # get all projects created by one specific user
    projects_by_user = graphene.List(ProjectType, user_id=graphene.ID())

    # -----------------------
    # TASK QUERIES
    # -----------------------
    all_tasks = graphene.List(TaskType)
    task = graphene.Field(TaskType, id=graphene.ID())

    # tasks by project
    tasks_by_project = graphene.List(TaskType, project_id=graphene.ID())

    # tasks assigned to a user
    tasks_by_user = graphene.List(TaskType, user_id=graphene.ID())

    # ----------------------------------
    # RESOLVERS
    # ----------------------------------
    def resolve_users(root, info):
        return CustomUser.objects.all()

    def resolve_user(root, info, id):
        return CustomUser.objects.get(id=id)

    def resolve_all_projects(root, info):
        return Project.objects.all()

    def resolve_project(root, info, id):
        return Project.objects.get(id=id)

    def resolve_projects_by_user(root, info, user_id):
        return Project.objects.filter(creator_id=user_id)

    def resolve_all_tasks(root, info):
        return Task.objects.all()

    def resolve_task(root, info, id):
        return Task.objects.get(id=id)

    def resolve_tasks_by_project(root, info, project_id):
        return Task.objects.filter(project_id=project_id)

    def resolve_tasks_by_user(root, info, user_id):
        return Task.objects.filter(assigned_to_id=user_id)
