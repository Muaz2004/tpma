import graphene
from core.graphql.queries import Query

schema = graphene.Schema(query=Query)
