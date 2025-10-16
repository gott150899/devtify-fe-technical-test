import { Button, Col, Flex, notification, Popover, Row, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { useMockup } from './hooks';
import { AppProvider } from './providers';
import type { MockupResponse, PagingBody, SortFilterBody, SortType } from './types';
import { appUtils, CONSTANT } from './utils';
import type { ColumnsType } from 'antd/es/table';
import { ActionBox, BioTooltip, TagVersion } from './components';
import { EyeOutlined } from '@ant-design/icons';
import { Drawer } from "antd";
import { Select } from "antd";

function App() {
  const { isStable, loading, onSimulateCallApi } = useMockup();
  const [api, contextHolder] = notification.useNotification();

  
  const [paging, setPaging] = useState<PagingBody>({ pageIndex: 1, pageSize: CONSTANT.pageSize });
  const [sortFilter, setSortFilter] = useState<SortFilterBody>({ filter: {}, sort: undefined });
  const [data, setData] = useState<MockupResponse[]>([]);
  const [viewDetailOpen, setViewDetailOpen] = useState(false);
  const [viewDetail, setViewDetail] = useState<MockupResponse | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if(!isStable) return;

    const onLoadData = async () => {
      const resp = await onSimulateCallApi(paging);
      setData(prev => [...prev, ...resp.data]);
      setIsCompleted(resp.isComplteted);
      console.log('load data', resp)
    }
    onLoadData();
  }, [isStable, paging])

  useEffect(() => {
    if(!isCompleted) return;

    api.success({
      message: 'Successfully',
      description: 'Fully loaded data'
    })
  }, [isCompleted])
  
  const columns: ColumnsType<MockupResponse>  = [
    {
      title: 'NO',
      key: 'no',
      width: 100,
      render: (_, __, index) => `${index + 1}.`
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
      render: (bio) => <BioTooltip textContent={bio} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: 100,
      render: (version) => <TagVersion version={version} />
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (createdDate) => appUtils.formatDateClient(createdDate)
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <ActionBox 
          color='#1890ff' 
          tooltip='View' 
          onClick={() => {
            setViewDetail(record)
            setViewDetailOpen(true)
          }}
        >
          <EyeOutlined/>
        </ActionBox>
    )
    },
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if(isCompleted) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;

    if (scrollHeight - scrollTop <= clientHeight + 150 && !loading){
      setPaging(prev => ({...prev, pageIndex: prev.pageIndex + 1}));
    }
  };

  const throttledScrollHandler = useCallback(appUtils.debounce(handleScroll, CONSTANT.mockupDebouceTime), [isCompleted, loading]);

  const content = (
    <Flex vertical gap={16}>
      <Flex vertical gap={8}>
        <span className='label-highlight'>Filter</span>
      </Flex>

      <Flex vertical gap={8}>
        <span className='label-highlight'>Sort</span>
        <Select
          defaultValue="lucy"
          style={{ width: 120 }}
          onChange={(value) => setSortFilter(prev => ({...prev, sort: value as SortType }))}
          options={[
            { value: 'increasing version', label: 'increasing version' },
            { value: 'descending version', label: 'descending version' },
          ]}
        />
      </Flex>
    </Flex>
  );

  return (
    <AppProvider>
      <div className='container'>
        <h1>Hello world</h1>
        {/* <button onClick={handleClick}>click</button> */}
        <Popover content={content} trigger="click">
          <Button>Sort And Filter</Button>
        </Popover>
        <Table 
          bordered
          dataSource={data} 
          columns={columns}
          pagination={false}
          loading={loading}
          rowKey="customId"
          scroll={{
            y: '70dvh'
          }}
          onScroll={throttledScrollHandler}
        />
      </div>
      <Drawer 
        open={viewDetailOpen} 
        title={viewDetail?.name}
        onClose={() => setViewDetailOpen(false)}
      >
        {
          viewDetail && (
            <Flex vertical gap={12}>
              <Flex vertical>
                <span className='label-highlight'>Id</span>
                <span>{viewDetail.id}</span>
              </Flex>
              <Flex vertical>
                <span className='label-highlight'>Bio</span>
                <span>{viewDetail.bio}</span>
              </Flex>
              <Flex vertical>
                <span className='label-highlight'>Language</span>
                <span>{viewDetail.language}</span>
              </Flex>
              <Flex vertical>
                <span className='label-highlight'>Version</span>
                <div>
                <TagVersion version={viewDetail.version} />
                </div>
              </Flex>
              <Flex vertical>
                <span className='label-highlight'>Created Date</span>
                <span>{appUtils.formatDateClient(viewDetail.createdDate)}</span>
              </Flex>
            </Flex>
          )
        }
      </Drawer>
      {contextHolder}
    </AppProvider>
  )
}

export default App