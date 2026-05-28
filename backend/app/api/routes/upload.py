from typing import Annotated
from datetime import timedelta
from fastapi import APIRouter, FastAPI,Path,HTTPException
from fastapi.middleware.cors import CORSMiddleware

import google.auth
from google.auth import impersonated_credentials
from google.cloud import storage
from google.cloud.exceptions import NotFound,GoogleCloudError
from google.auth.transport.requests import Request 

from core.config import settings

router = APIRouter()
    
@router.get("/upload-signed-url/{object_name}")
def generate_upload_signed_url(object_name:Annotated[str,Path(description="The name of the object to be uploaded")]):
    """ 
      Generate a signed URL for uploading an object to the cloud storage.
      - **object_name**: The name of the object to be uploaded.
      Returns a signed URL that can be used to upload the object to the cloud storage.    
    """
    try:
        # Get your BASE credentials (your user account)
        # This automatically uses your active identity (ADC)
        credentials, project = google.auth.default()
        print(f"Service Account Email: {credentials.service_account_email}")
        print(f"Token: {credentials.token}")
        print(f"Project ID: {project}")
    
        # Manually create the Impersonated Credentials
        # This bypasses any weirdness in the gcloud CLI state
       
        target_creds = impersonated_credentials.Credentials(
        source_credentials=credentials,
        target_principal= credentials.service_account_email, # The service account email to impersonate (same as your user account)
        target_scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
    
        #Refresh to get the token
        target_creds.refresh(Request())
        

        # Initialize the Google Cloud Storage client
        client = storage.Client(credentials=target_creds, project=project)

        bucket = client.bucket(settings.GCS_BUCKET_NAME) # This should be set in the .env file and accessed via os.environ
        blob = bucket.blob("uploads/" + object_name) # You can customize the path as needed
       

        # Generate a signed URL for uploading the object
        signed_url = blob.generate_signed_url(
            version="v4", 
            expiration=timedelta(minutes=15), 
            method="PUT", 
            content_type="application/octet-stream",
            service_account_email=target_creds.service_account_email,
            access_token=target_creds.token
            
            ) # URL valid for 15 minutes
             
        return {"signed_url": signed_url}
    
    except NotFound:
         # Bucket does not exist or insufficient permissions
        raise HTTPException(status_code=404, detail=f"Bucket {settings.GCS_BUCKET_NAME} not found.")
    except GoogleCloudError as gc_error:
         # Other GCS‑specific errors (403, 500, etc.)
        raise HTTPException(status_code=getattr(gc_error, 'code', 500), detail=f"Google Cloud error: {gc_error.message or str(gc_error)}")
    except Exception as exc:
         # Unexpected server errors
        raise HTTPException(status_code=500, detail=f"Internal error: {exc}") 

    
