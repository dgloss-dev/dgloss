import React, { Suspense } from 'react';
import { CallListPageHeader } from './_components/callListPageHeader';
import { CallListTable } from './_components/callListTable';
import { getServerAllCallLists } from '@client/services/callList.server.services';
import { DetailsTable } from '@client/components/common/commonTable/detailsTable';

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
    </Suspense>
  );
};

export default CallListManagementPage;
