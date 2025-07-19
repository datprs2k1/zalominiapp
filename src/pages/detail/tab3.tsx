import { useAtom } from 'jotai';
import FabForm from '@/components/form/fab-form';
import { useResetAtom } from 'jotai/utils';
import SymptomInquiry from '@/components/form/symptom-inquiry';
import { useContext, useState } from 'react';
import { promptJSON, wait } from '@/utils/miscellaneous';
import QuestionSentSuccessfully from '../ask/success';
import { DetailPageContext } from './context';
import BookingPage from '../booking';

function Tab3() {
  const { tab3 } = useContext(DetailPageContext);
  const [formData, setFormData] = useAtom(tab3.formData);
  const resetFormData = useResetAtom(tab3.formData);

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return <QuestionSentSuccessfully />;
  }

  return <BookingPage />;
}

export default Tab3;
