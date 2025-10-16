import { Button, Col, Flex, Input, notification, Popover, Row, Table } from 'antd';
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
  const [sortFilterBinding, setSortFilterBinding] = useState<SortFilterBody>({ filter: {}, sort: undefined });
  const [sortFilter, setSortFilter] = useState<SortFilterBody>({ filter: {}, sort: undefined });
  const [data, setData] = useState<MockupResponse[]>([]);
  const [viewDetailOpen, setViewDetailOpen] = useState(false);
  const [viewDetail, setViewDetail] = useState<MockupResponse | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [searchOpen, setsearchOpen] = useState(false);

  useEffect(() => {
    if(!isStable) return;

    const onLoadData = async () => {
      const resp = await onSimulateCallApi(paging, sortFilter);
      setData(prev => [...prev, ...resp.data]);
      setIsCompleted(resp.isComplteted);
      // console.log('load data', resp)
    }
    onLoadData();
  }, [isStable, paging])

  useEffect(() => {
    if(!isCompleted || !data.length) return;

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
      minWidth: 100,
      render: (_, __, index) => `${index + 1}.`
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      minWidth: 180,
    },
    {
      title: 'Bio',
      dataIndex: 'bio',
      key: 'bio',
      width: 200,
      minWidth: 200,
      render: (bio) => <BioTooltip textContent={bio} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      minWidth: 150,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      width: 150,
      minWidth: 150,
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
      width: 200,
      minWidth: 200,
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

  const handleSetFiltersChange = (key: string, value: string) => {
    setSortFilterBinding(prev => ({...prev, filter: {...prev.filter, [key]: value }}))
  }

  const handleClearSortFilter = () => {
    if(loading) return;

    setData([]);
    setSortFilter({ filter: {}, sort: undefined });
    setSortFilterBinding({ filter: {}, sort: undefined });
    setPaging({ pageIndex: 1, pageSize: CONSTANT.pageSize });
    setsearchOpen(false);
  }

  const handleApplySortFilter = () => {
    if(loading) return;

    setData([]);
    setSortFilter({...sortFilterBinding});
    setPaging({ pageIndex: 1, pageSize: CONSTANT.pageSize });
    setsearchOpen(false);
  }

  const content = (
    <Flex vertical gap={16}>
      <Flex vertical gap={8}>
        <span className='label-highlight'>Filters</span>
        <Row gutter={12}>
          <Col span={12}>
            <span>Name</span>
            <Input value={sortFilterBinding.filter['name']} onChange={(e) => handleSetFiltersChange('name', e.target.value)} />
          </Col>
          <Col span={12}>
            <span>Language</span>
            <Input value={sortFilterBinding.filter['language']} onChange={(e) => handleSetFiltersChange('language', e.target.value)} />
          </Col>
        </Row>
      </Flex>

      <Flex vertical gap={8}>
        <span className='label-highlight'>Sort</span>
        <Row >
          <Col span={24}>
            <span>Version</span>
            <Select
              style={{ width: '100%' }}
              onChange={(value) => setSortFilterBinding(prev => ({...prev, sort: value as SortType }))}
              options={[
                { value: 'increasing version', label: 'Increasing version' },
                { value: 'descending version', label: 'Descending version' },
              ]}
            />
          </Col>
        </Row>
      </Flex>

      <Flex gap={8} justify='flex-end'>
          <Button  onClick={handleClearSortFilter}>Clear</Button>
          <Button color="primary" variant="solid" onClick={handleApplySortFilter}>Apply</Button>
      </Flex>
    </Flex>
  );

  return (
    <AppProvider>
      <div className='container'>
        <Flex justify='center'>
          <h2>Tran Ty Go - [Front-End Developer] Technical Test</h2>
        </Flex>
        <Flex gap={8} vertical align='flex-end'>
          <div>
            <Popover placement='bottomRight' content={content} trigger="click" open={searchOpen} onOpenChange={(open) => setsearchOpen(open)}>
              <Button color="primary" variant="outlined">Sort And Filters</Button>
            </Popover>
          </div>
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
        </Flex>
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