import { addConsultantRecord } from '@/service/session';
import { shutDownSession } from '@/store/chat/chatSlice';
import { RootState } from '@/store/store';
import { ProFormRate, ProFormTextArea } from '@ant-design/pro-components';
import { Form, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RateModal = ({
  visible,
  onCancel,
  data,
}: {
  visible: boolean;
  onCancel: () => void;
  data: {
    counsellorID: number;
    userID: number;
    sessionID: number;
  };
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useSelector((state: RootState) => state.user);

  const onFinish = async ({ score, comment }: { score: number; comment: string }) => {
    dispatch(
      shutDownSession({
        sessionID: data.sessionID,
      }),
    );
    navigate('/');

    await addConsultantRecord({
      ...data,
      userID: Number(uid),
      userRating: score,
      appraisal: comment,
      counsellorAppraisal: '',
    });
  };

  return (
    <Modal
      title='请评价本次咨询'
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        form.submit();
      }}
    >
      <Form form={form} onFinish={onFinish}>
        <ProFormRate name='score' label='评分' formItemProps={{ rules: [{ required: true }] }} fieldProps={{ allowHalf: true }} />
        <ProFormTextArea name='comment' label='评价' formItemProps={{ rules: [{ required: true }] }} fieldProps={{ maxLength: 50 }} />
      </Form>
    </Modal>
  );
};

export default RateModal;
