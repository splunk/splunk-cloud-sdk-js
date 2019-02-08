yarn run openapi-generator generate \
     --input-spec ./generation_files/spec_files/logan_action-v5-oa3.yaml \
     --generator-name typescript-fetch \
     --output ./generated_api/action \
     --template-dir ./generation_files/templates/typescript-fetch