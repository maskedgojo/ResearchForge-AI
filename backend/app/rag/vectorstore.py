import chromadb

from app.core.config import settings


class VectorStore:


    def __init__(self):

        self.client = chromadb.PersistentClient(
            path=settings.chroma_path
        )


        self.collection = (
            self.client.get_or_create_collection(
                name="research_documents"
            )
        )



    def add_document(
        self,
        document_id: str,
        text: str,
        metadata: dict
    ):


        self.collection.add(

            ids=[
                document_id
            ],

            documents=[
                text
            ],

            metadatas=[
                metadata
            ]

        )



    def search(
        self,
        query: str,
        limit: int = 3,
        research_id: str | None = None
    ):


        where_filter = None


        if research_id:

            where_filter = {
                "research_id": research_id
            }


        result = self.collection.query(

            query_texts=[
                query
            ],

            n_results=limit,

            where=where_filter

        )


        return result


    def count(self):

        return self.collection.count()



vector_store = VectorStore()