import React, { Suspense } from 'react';
import { CallListPageHeader } from './_components/callListPageHeader';
import { CallListTable } from './_components/callListTable';
import { getServerAllCallLists } from '@client/services/callList.server.services';
import { FormModal } from '@client/components/common/form';
import { CallListForm } from './_components/callListForm';

const CallListManagementPage = async () => {
  let data;
  try {
    const response = await getServerAllCallLists();
    data = response.data;
  } catch (error) {
    console.error('Error fetching criteria data:', error);
    data = {
      rows: [],
      count: 0,
    };
  }

  return (
    <Suspense fallback={<></>}>
      <CallListPageHeader />
      <CallListTable initialData={data?.rows} initialCount={data?.count} />
      <FormModal
        modalKey="callList"
        formComponent={<CallListForm />}
        titleKey={'call_list_register'}
      ></FormModal>
    </Suspense>
  );
};

export default CallListManagementPage;
