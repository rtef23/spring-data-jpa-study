//======== import external library
const {
  Container, Tabs, Tab, Box, Typography,
  Grid, TextField, Button, TableContainer, Table,
  TableHead, TableBody, TableRow, TableCell, Paper,
  Snackbar, IconButton, Select, MenuItem
} = MaterialUI;

//======== constants
const TABS = {
  HOME : {
    value : 'HOME',
    label : 'HOME'
  },
  MEMBER_JOIN : {
    value : 'MEMBER_JOIN',
    label : '회원 가입'
  },
  MEMBER_LIST : {
    value : 'MEMBER_LIST',
    label : '회원 목록'
  },
  PRODUCT_ENROLL : {
    value : 'PRODUCT_ENROLL',
    label : '상품 등록'
  },
  PRODUCT_LIST : {
    value : 'PRODUCT_LIST',
    label : '상품 목록'
  },
  PRODUCT_ORDER : {
    value : 'PRODUCT_ORDER',
    label : '상품 주문'
  },
  ORDER_LIST : {
    value : 'ORDER_LIST',
    label : '주문 내역'
  },
};

const ITEM_TYPE = {
  ALBUM: 'ALBUM',
  BOOK: 'BOOK',
  MOVIE: 'MOVIE',
};

//======== api
const _axios = axios.create({
  paramsSerializer: (params) => {
    return Qs.stringify(params, {
      allowDots: true
    });
  }
});

const MemberApi = {
  getMembers: (searchCondition) => {
    return _axios.get('/api/v1/members', {
      params: {
        ...searchCondition,

        keywordType: !!searchCondition.keyword ? searchCondition.keywordType : undefined,
        keyword: !!searchCondition.keyword ? searchCondition.keyword : undefined
      }
    });
  },
  addMember: (member) => {
    return _axios.post('/api/v1/members', {
      ...member
    });
  },
  updateMember: (id, updateValue) => {
    return _axios.patch(`/api/v1/members/${id}`, {
      ...updateValue
    });
  },
  removeMember: (id) => {
    return _axios.delete(`/api/v1/members/${id}`);
  }
};

//======== custom Hooks
const TabContext = React.createContext({
  currentTab : '',
  changeCurrentTab : () => {}
});

const SnackbarContext = React.createContext();

const INIT_SNACKBAR_PROPERTIES = {
  show: false,
  message: '',
  type: 'success'
};

const SnackbarProvider = ({children}) => {
  const [snackbarProperties, setSnackbarProperties] = React.useState(INIT_SNACKBAR_PROPERTIES);

  const actions = {
    showSnackbar: ({type, message}) => {
      setSnackbarProperties({
        ...snackbarProperties,

        show: true,
        message,
        type
      });
    },

    hideSnackbar: () => {
      setSnackbarProperties({
        ...INIT_SNACKBAR_PROPERTIES,
      });
    }
  };

  return (
    <SnackbarContext.Provider value={{ actions }}>
      {children}

      <Snackbar open={snackbarProperties.show} autoHideDuration={3000} onClose={actions.hideSnackbar} message={snackbarProperties.message} action={
        <React.Fragment>
          <IconButton size="small" aria-label="close" color="inherit" onClick={actions.hideSnackbar}>
            X
          </IconButton>
        </React.Fragment>
      } />
    </SnackbarContext.Provider>
  );
};

const MEMBER_SEARCH_TYPE = {
  NAME: 'NAME',
  ADDRESS: 'ADDRESS'
};

const INIT_MEMBER_SEARCH_CONDITION = {
  keywordType: MEMBER_SEARCH_TYPE.NAME,
  keyword: undefined,
  page: 1,
  size: 10
};

const MemberListContext = React.createContext();

const MemberListProvider = ({children}) => {
  const [ searchCondition, changeSearchCondition ] = React.useState(INIT_MEMBER_SEARCH_CONDITION);
  const [ members, setMembers ] = React.useState([]);

  const modifyMember = (id, updateValue) => {
    return MemberApi.updateMember(id, updateValue)
      .then(() => MemberApi.getMembers(searchCondition))
      .then((apiResponse) => {
        const { data } = apiResponse;
        const { content } = data;

        setMembers(content);
      });
  };

  const removeMember = (id) => {
    return MemberApi.removeMember(id)
      .then(() => MemberApi.getMembers(searchCondition))
      .then((apiResponse) => {
        const { data } = apiResponse;
        const { content } = data;

        setMembers(content);
      });
  }

  const actions = {
    changeSearchCondition,
    modifyMember,
    removeMember
  };

  React.useEffect(() => {
    MemberApi
      .getMembers(searchCondition)
      .then((apiResponse) => {
        const { data } = apiResponse;
        const { content } = data;

        setMembers(content);
      });
  }, [searchCondition]);

  return (
    <MemberListContext.Provider value={{ searchCondition, members, actions }}>
      {children}
    </MemberListContext.Provider>
  );
};

//======== util react components
const CustomTabPanel = ({ children, id, value, ...other}) => {
  return (
    <TabContext.Consumer>
    {({ currentTab }) => {
      const isSelected = currentTab === value;

      return (
        <div role="tabpanel"
             hidden={!isSelected}
             id={`vertical-tabpanel-${value}`}
             aria-labelledby={`vertical-tab-${value}`}
             style={{width: '100%'}}
             {...other}>
          {isSelected && (
            <Box p={3} style={{paddingTop: '0px'}}>
              {children}
            </Box>
          )}
        </div>
      );
    }}
    </TabContext.Consumer>
  );
};

//======== content react components
const HomeTabPanel = () => {
  return (
    <Grid container spacing={1} style={{alignItems: 'center'}}>
      <h3>Select Tab on Left!</h3>
    </Grid>
  );
}

const MemberJoinTabPanel = () => {
  const nameRef = React.createRef();
  const cityRef = React.createRef();
  const streetRef = React.createRef();
  const zipcodeRef = React.createRef();

  const handleClickInitializeButton = () => {
    nameRef.current.value = "";
    cityRef.current.value = "";
    streetRef.current.value = "";
    zipcodeRef.current.value = "";
  };

  const handleClickJoinButton = () => {
    MemberApi.addMember({
      name: nameRef.current.value,
      addressCity: cityRef.current.value,
      addressStreet: streetRef.current.value,
      addressZipcode: zipcodeRef.current.value
    });
  };

  return (
    <Grid container spacing={1} style={{alignItems: 'flex-start'}}>
      <Grid item xs={12}>
        <h3>회원 가입</h3>
      </Grid>

      <Grid item xs={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item xs={2} style={{paddingTop: '10px'}}>
            이름
          </Grid>
          <Grid item xs={10} style={{alignItems: 'flex-start'}}>
            <TextField inputRef={nameRef} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item xs={2} style={{paddingTop: '10px'}}>
            주소
          </Grid>
          <Grid item xs={8} style={{alignItems: 'flex-start'}}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <TextField label={"도시"} inputRef={cityRef} />
              </Grid>
              <Grid item xs={6}>
                <TextField label={"상세 주소"} inputRef={streetRef} fullWidth />
              </Grid>

              <Grid item xs={12}>
                <TextField label={"우편 번호"} inputRef={zipcodeRef} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button variant={'contained'} color={'secondary'} style={{marginRight: '5px'}} onClick={handleClickInitializeButton}>
          초기화
        </Button>
        <Button variant={'contained'} color={'primary'} onClick={handleClickJoinButton}>
          가입
        </Button>
      </Grid>
    </Grid>
  );
}

const MemberListTabPanel = () => {
  return (
    <MemberListProvider>
      <Grid container spacing={1} style={{alignItems: 'flex-start'}}>
        <Grid item xs={12}>
          <h3>회원 목록</h3>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table style={{minWidth: '700px'}}>
              <MemberListContext.Consumer>
                {({searchCondition, actions}) => (
                  <MemberListTableHead searchCondition={searchCondition} onChangeSearchCondition={actions.changeSearchCondition} />
                )}
              </MemberListContext.Consumer>

              <MemberListTableBody />
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </MemberListProvider>
  );
}

const MemberListTableHead = ({searchCondition, onChangeSearchCondition}) => {
  const [ properties, setProperties ] = React.useState({
    keywordType: searchCondition.keywordType
  });

  const keywordRef = React.createRef();

  const handleChangeKeywordType = ({target}) => {
    const { value } = target;

    setProperties({
      ...properties,

      keywordType: value
    });
  };

  const handleClickSearchButton = () => {
    onChangeSearchCondition({
      ...INIT_MEMBER_SEARCH_CONDITION,

      keywordType: properties.keywordType,
      keyword: keywordRef.current.value
    });
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell colSpan={4}>
          <div style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
            <Select value={properties.keywordType} onChange={handleChangeKeywordType}>
              <MenuItem value={MEMBER_SEARCH_TYPE.NAME}>
                이름
              </MenuItem>
              <MenuItem value={MEMBER_SEARCH_TYPE.ADDRESS}>
                주소
              </MenuItem>
            </Select>

            <TextField inputRef={keywordRef} />

            <Button variant={'contained'} color={'primary'} size={'small'} onClick={handleClickSearchButton}>검색</Button>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell>
          No.
        </TableCell>
        <TableCell style={{width: '200px'}}>
          이름
        </TableCell>
        <TableCell style={{width: '450px'}}>
          주소
        </TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

const MemberListTableBody = () => {
  return (
    <MemberListContext.Consumer>
      {({ members, actions, searchCondition }) => (
        <TableBody>
          {!members.length && (
            <TableRow>
              <TableCell colSpan={4}>
                검색된 회원 목록이 없습니다.
              </TableCell>
            </TableRow>
          )}
          {members.map((member, index) => (
            <MemberRow
              key={index}
              index={index}
              member={member}
              onChangeMember={actions.modifyMember}
              onRemoveMember={actions.removeMember} />
          ))}
        </TableBody>
      )}
    </MemberListContext.Consumer>
  );
}

const MEMBER_ROW_TYPE = {
  VIEW: 'VIEW',
  EDIT: 'EDIT'
};

const INIT_MEMBER_ROW_PROPERTIES = {
  type: MEMBER_ROW_TYPE.VIEW
};

const MemberRow = ({ member, index, onChangeMember, onRemoveMember }) => {
  const [properties, setProperties] = React.useState(INIT_MEMBER_ROW_PROPERTIES);
  const [memberData, setMemberData] = React.useState(member)

  const handleClickEditButton = () => {
    setProperties({
      ...properties,

      type: MEMBER_ROW_TYPE.EDIT
    });
  };

  const handleClickCancelButton = () => {
    setProperties({
      ...properties,

      type: MEMBER_ROW_TYPE.VIEW
    });
  };

  const handleChangeMemberData = (key, updateValue) => {
    setMemberData({
      ...memberData,

      [key]: updateValue
    });
  };

  const handleClickUpdateButton = () => {
    const { id } = member;

    onChangeMember(id, memberData)
      .then(() => {
        setProperties(INIT_MEMBER_ROW_PROPERTIES);
      });
  };

  const handleClickRemoveButton = () => {
    const { id } = member;

    onRemoveMember(id);
  };

  return (
    <React.Fragment>
      {properties.type === MEMBER_ROW_TYPE.VIEW && (
          <TableRow>
            <TableCell>
              {index + 1}
            </TableCell>
            <TableCell>
              {member.name}
            </TableCell>
            <TableCell>
              {`${member.addressCity} ((우) ${member.addressZipcode}) ${member.addressStreet}`}
            </TableCell>
            <TableCell>
              <Button variant={'contained'} color={'primary'} size={'small'} onClick={handleClickEditButton}>수정</Button>
              <Button variant={'contained'} color={'secondary'} size={'small'} onClick={handleClickRemoveButton}>삭제</Button>
            </TableCell>
          </TableRow>
      )}

      {properties.type === MEMBER_ROW_TYPE.EDIT && (
          <TableRow style={{alignItems: 'flex-start'}}>
            <TableCell>
              {index + 1}
            </TableCell>
            <TableCell>
              <TextField value={memberData.name} onChange={({target}) => handleChangeMemberData('name', target.value)} />
            </TableCell>
            <TableCell>
              <TextField label={'도시'} value={memberData.addressCity} onChange={({target}) => handleChangeMemberData('addressCity', target.value)} />
              <TextField label={'상세 주소'} value={memberData.addressStreet} onChange={({target}) => handleChangeMemberData('addressStreet', target.value)} />
              <TextField label={'우편 번호'} value={memberData.addressZipcode} onChange={({target}) => handleChangeMemberData('addressZipcode', target.value)} />
            </TableCell>
            <TableCell>
              <Button variant={'contained'} color={'primary'} size={'small'} onClick={handleClickUpdateButton}>수정</Button>
              <Button variant={'contained'} color={'secondary'} size={'small'} onClick={handleClickCancelButton}>취소</Button>
            </TableCell>
          </TableRow>
      )}
    </React.Fragment>
  );
}

const INIT_PRODUCT_ENROLL_PROPERTIES = {
  itemType: ITEM_TYPE.ALBUM
};

const ProductEnrollTabPanel = () => {
  const [ properties, setProperties ] = React.useState(INIT_PRODUCT_ENROLL_PROPERTIES);

  const handleChangeItemType = ({target}) => {
    const { value } = target;

    setProperties({
      ...properties,

      itemType : value
    });
  };

  return (
    <Grid container spacing={1} style={{alignItems: 'flex-start'}}>
      <Grid item xs={12}>
        <h3>상품 등록</h3>
      </Grid>

      <Grid item xs={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item xs={2} style={{paddingTop: '10px'}}>
            상품 타입
          </Grid>
          <Grid item xs={8}>
            <Select value={properties.itemType} onChange={handleChangeItemType}>
              <MenuItem value={ITEM_TYPE.ALBUM}>
                앨범
              </MenuItem>
              <MenuItem value={ITEM_TYPE.BOOK}>
                도서
              </MenuItem>
              <MenuItem value={ITEM_TYPE.MOVIE}>
                영화
              </MenuItem>
            </Select>
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item xs={2} style={{paddingTop: '10px'}}>
            상품명
          </Grid>
          <Grid item xs={8}>
            <TextField />
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            가격
          </Grid>
          <Grid item xs={8}>
            <TextField />
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            재고
          </Grid>
          <Grid item xs={8}>
            <TextField />
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            카테고리
          </Grid>
          <Grid item xs={8}>
            <Select>
              <MenuItem>카테고리1</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      </Grid>

      {properties.itemType === ITEM_TYPE.ALBUM && (
        <React.Fragment>
          <Grid item xs={12} style={{marginBottom: '10px'}}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                작곡가
              </Grid>
              <Grid item xs={8}>
                <TextField />
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{marginBottom: '10px'}}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                기타
              </Grid>
              <Grid item xs={8}>
                <TextField />
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      )}

      {properties.itemType === ITEM_TYPE.BOOK && (
        <React.Fragment>
          <Grid item xs={12} style={{marginBottom: '10px'}}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                저자
              </Grid>
              <Grid item xs={8}>
                <TextField />
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{marginBottom: '10px'}}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                isbn
              </Grid>
              <Grid item xs={8}>
                <TextField />
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      )}

      {properties.itemType === ITEM_TYPE.MOVIE && (
        <React.Fragment>
          <Grid item xs={12} style={{marginBottom: '10px'}}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                감독
              </Grid>
              <Grid item xs={8}>
                <TextField />
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{marginBottom: '10px'}}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                배우
              </Grid>
              <Grid item xs={8}>
                <TextField />
              </Grid>
              <Grid item xs={2}>
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      )}

      <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button variant={'contained'} color={'primary'}>
          등록
        </Button>
      </Grid>

    </Grid>
  );
}

const ProductListTabPanel = () => {
  return (
    <div>
      this is ProductListTabPanel
    </div>
  );
}

const ProductOrderTabPanel = () => {
  return (
    <div>
      this is ProductOrderTabPanel
    </div>
  );
}

const OrderListTabPanel = () => {
  return (
    <div>
      this is OrderListTabPanel
    </div>
  );
}

const Content = () => {
  const [currentTab, changeCurrentTab] = React.useState(TABS.HOME.value);

  return (
    <TabContext.Provider value={{ currentTab, changeCurrentTab }}>
      <SnackbarProvider>
        <div style={{display: 'flex', flexGrow: 1}}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            style={{display: 'flex', borderRight : 'solid 1px black'}}
            value={currentTab}
            onChange={(event, value) => changeCurrentTab(value)}>
            {Object.keys(TABS).map((tabKey, index) => {
              const { value } = TABS[tabKey];

              return (<Tab key={index} id={`vertical-tab-${value}`} aria-controls={`vertical-tabpanel-${value}`} {...TABS[tabKey]} />);
            })}
          </Tabs>

          <div style={{display: 'flex', flexGrow: 4}}>
            <CustomTabPanel value={TABS.HOME.value}>
              <HomeTabPanel />
            </CustomTabPanel>

            <CustomTabPanel value={TABS.MEMBER_JOIN.value}>
              <MemberJoinTabPanel />
            </CustomTabPanel>

            <CustomTabPanel value={TABS.MEMBER_LIST.value}>
              <MemberListTabPanel />
            </CustomTabPanel>

            <CustomTabPanel value={TABS.PRODUCT_ENROLL.value}>
              <ProductEnrollTabPanel />
            </CustomTabPanel>

            <CustomTabPanel value={TABS.PRODUCT_LIST.value}>
              <ProductListTabPanel />
            </CustomTabPanel>

            <CustomTabPanel value={TABS.PRODUCT_ORDER.value}>
              <ProductOrderTabPanel />
            </CustomTabPanel>

            <CustomTabPanel value={TABS.ORDER_LIST.value}>
              <OrderListTabPanel />
            </CustomTabPanel>
          </div>
        </div>
      </SnackbarProvider>
    </TabContext.Provider>
  );
};

//======== init
class App extends React.Component {
  render(){
    return (
      <Container className={'root'}>
        <h2>Hello Shop</h2>
        <Content />
      </Container>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));