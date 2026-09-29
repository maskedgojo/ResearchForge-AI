from app.rag.vectorstore import vector_store



result = vector_store.search(
    "How does AI affect software developers?"
)


print(result)