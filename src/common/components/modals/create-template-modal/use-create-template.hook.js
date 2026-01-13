import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTemplate } from '@/provider/features/template/template.slice';

function useCreateTemplate({ documentType, modalCloseHandler }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [templateName, setTemplateName] = useState();

  const handleCreateTemplate = async () => {
    const response = await dispatch(
      createTemplate({
        payload: {
          templateName,
          documentType
        }
      })
    );
    if (response.payload.id) {
      const temId = response.payload.id;
      const docType = response.payload.documentType;
      modalCloseHandler();
      router.push(`/create-template?id=${temId}&docType=${docType}`);
    }
  };

  const handleSaveTemplate = (e) => {
    setTemplateName(e.target.value);
  };

  return {
    templateName,
    handleSaveTemplate,
    handleCreateTemplate
  };
}

export default useCreateTemplate;
