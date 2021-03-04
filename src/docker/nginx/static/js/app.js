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

const ItemApi = {
  getItems: (searchCondition) => {
    return _axios.get('/api/v1/items', {
      params: {
        ...searchCondition,
      }
    });
  },

  addBook: (book) => {
    return _axios.post('/api/v1/items/books', {
      ...book
    })
  },

  addAlbum: (album) => {
    return _axios.post('/api/v1/items/albums', {
      ...album
    })
  },

  addMovie: (movie) => {
    return _axios.post('/api/v1/items/movies', {
      ...movie
    })
  },

  updateBook: (id, updateValue) => {
    return _axios.put(`/api/v1/items/books/${id}`, {
      ...updateValue
    });
  },

  updateAlbum: (id, updateValue) => {
    return _axios.put(`/api/v1/items/albums/${id}`, {
      ...updateValue
    });
  },

  updateMovie: (id, updateValue) => {
    return _axios.put(`/api/v1/items/movies/${id}`, {
      ...updateValue
    });
  },

  removeItem: (id) => {
    return _axios.delete(`/api/v1/items/${id}`);
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

const INIT_ITEM_SEARCH_CONDITION = {
  itemType: undefined,
  name: undefined,

  page: 1,
  size: 10
};

const ItemListContext = React.createContext();

const ItemListProvider = ({children}) => {
  const [ searchCondition, changeSearchCondition ] = React.useState(INIT_ITEM_SEARCH_CONDITION);
  const [ items, setItems ] = React.useState([]);

  React.useEffect(() => {
    ItemApi
      .getItems(searchCondition)
      .then((apiResponse) => {
        const { data } = apiResponse;
        const { content } = data;

        setItems(content);
      });
  }, [searchCondition]);

  const modifyBook = (id, updateValue) => {
    return ItemApi
      .modifyBook(id, updateValue)
      .then(() => ItemApi.getItems(searchCondition))
      .then((apiResponse) => {
        const { data } = apiResponse;
        const { content } = data;

        setItems(content);
      });
  };

  const modifyAlbum = (id, updateValue) => {
    return ItemApi
      .modifyAlbum(id, updateValue)
      .then(() => ItemApi.getItems(searchCondition))
      .then((apiResponse) => {
        const { data } = apiResponse;
        const { content } = data;

        setItems(content);
      });
  };

  const modifyMovie = (id, updateValue) => {
    return ItemApi
      .modifyMovie(id, updateValue)
      .then(() => ItemApi.getItems(searchCondition))
      .then((apiResponse) => {
        const { data } = apiResponse;
        const { content } = data;

        setItems(content);
      });
  };

  const removeItem = (id) => {
    return ItemApi
      .removeItem(id)
      .then(() => ItemApi.getItems(searchCondition))
      .then((apiResponse) => {
        const { data } = apiResponse;
        const { content } = data;

        setItems(content);
      });
  };

  const actions = {
    changeSearchCondition,
    modifyBook,
    modifyAlbum,
    modifyMovie,
    removeItem
  };

  return (
    <ItemListContext.Provider value={{searchCondition, items, actions }}>
      {children}
    </ItemListContext.Provider>
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
            <Box p={3} style={{paddingTop: '0px', width: '900px'}}>
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
      <Grid item sm={12}>
        <h3>회원 가입</h3>
      </Grid>

      <Grid item sm={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item sm={2} style={{paddingTop: '10px'}}>
            이름
          </Grid>
          <Grid item sm={10} style={{alignItems: 'flex-start'}}>
            <TextField inputRef={nameRef} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item sm={12} style={{marginBottom: '10px'}}>
        <Grid container spacing={1}>
          <Grid item sm={2} style={{paddingTop: '10px'}}>
            주소
          </Grid>
          <Grid item sm={8} style={{alignItems: 'flex-start'}}>
            <Grid container spacing={1}>
              <Grid item sm={4}>
                <TextField label={"도시"} inputRef={cityRef} />
              </Grid>
              <Grid item sm={6}>
                <TextField label={"상세 주소"} inputRef={streetRef} fullWidth />
              </Grid>

              <Grid item sm={12}>
                <TextField label={"우편 번호"} inputRef={zipcodeRef} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={2}></Grid>
        </Grid>
      </Grid>

      <Grid item sm={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
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
        <Grid item sm={12}>
          <h3>회원 목록</h3>
        </Grid>

        <Grid item sm={12}>
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

const INIT_ALBUM_VALUES = {
  artist: '',
  etc: ''
};

const INIT_BOOK_VALUES = {
  author: '',
  isbn: ''
};

const INIT_MOVIE_VALUES = {
  director: '',
  actor: ''
};

const INIT_PRODUCT_ENROLL_PROPERTIES = {
  itemType: ITEM_TYPE.ALBUM,

  typeValues: {
    ...INIT_ALBUM_VALUES
  }
};

const ProductEnrollTabPanel = () => {
  const nameRef = React.createRef();
  const priceRef = React.createRef();
  const stockQuantityRef = React.createRef();

  const [ properties, setProperties ] = React.useState(INIT_PRODUCT_ENROLL_PROPERTIES);

  const handleChangeItemType = ({target}) => {
    const { value } = target;

    setProperties({
      ...properties,

      itemType : value,

      typeValues: value === ITEM_TYPE.ALBUM ? INIT_ALBUM_VALUES : value === ITEM_TYPE.BOOK ? INIT_BOOK_VALUES : INIT_MOVIE_VALUES
    });
  };

  const handleChangeTypeValues = (typeValues) => {
    setProperties({
      ...properties,

      typeValues
    });
  };

  const handleClickEnrollButton = () => {
    const { itemType, typeValues } = properties;

    switch(itemType){
      case ITEM_TYPE.ALBUM:
        ItemApi.addAlbum({
          name: nameRef.current.value,
          price: priceRef.current.value,
          stockQuantity: stockQuantityRef.current.value,

          ...typeValues
        });
      break;

      case ITEM_TYPE.BOOK:
        ItemApi.addBook({
          name: nameRef.current.value,
          price: priceRef.current.value,
          stockQuantity: stockQuantityRef.current.value,

          ...typeValues
        });
      break;

      case ITEM_TYPE.MOVIE:
        ItemApi.addMovie({
          name: nameRef.current.value,
          price: priceRef.current.value,
          stockQuantity: stockQuantityRef.current.value,

          ...typeValues
        });
      break;

      default:
    }
  };

  return (
    <Grid container spacing={1} alignItems={'flex-start'}>
      <Grid item sm={12}>
        <h3>상품 등록</h3>
      </Grid>

      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2} style={{paddingTop: '10px'}}>
          상품 타입
        </Grid>
        <Grid item sm={10}>
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
      </Grid>

      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2} style={{paddingTop: '10px'}}>
          상품명
        </Grid>
        <Grid item sm={10}>
          <TextField inputRef={nameRef} />
        </Grid>
      </Grid>

      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          가격
        </Grid>
        <Grid item sm={10}>
          <TextField inputRef={priceRef} />
        </Grid>
      </Grid>

      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          재고
        </Grid>
        <Grid item sm={10}>
          <TextField inputRef={stockQuantityRef} />
        </Grid>
      </Grid>

      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          카테고리
        </Grid>
        <Grid item sm={10}>
          <Select>
            <MenuItem>카테고리1</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {properties.itemType === ITEM_TYPE.ALBUM && (
        <AlbumProduct typeValues={properties.typeValues} onChange={handleChangeTypeValues} />
      )}

      {properties.itemType === ITEM_TYPE.BOOK && (
        <BookProduct typeValues={properties.typeValues} onChange={handleChangeTypeValues} />
      )}

      {properties.itemType === ITEM_TYPE.MOVIE && (
        <MovieProduct typeValues={properties.typeValues} onChange={handleChangeTypeValues} />
      )}

      <Grid item container sm={12} style={{justifyContent: 'flex-end'}}>
        <Grid item sm={12}>
          <Button variant={'contained'} color={'primary'} onClick={handleClickEnrollButton}>
            등록
          </Button>
        </Grid>
      </Grid>

    </Grid>
  );
};

const AlbumProduct = ({typeValues, onChange}) => {
  const { artist, etc } = typeValues;

  const handleChangeArtist = (value) => {
    onChange({
      ...typeValues,

      artist: value
    });
  }

  const handleChangeEtc = (value) => {
    onChange({
      ...typeValues,

      etc: value
    });
  };

  return (
    <React.Fragment>
      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          작곡가
        </Grid>
        <Grid item sm={10}>
          <TextField value={artist} onChange={({target}) => handleChangeArtist(target.value)} />
        </Grid>
      </Grid>

      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          기타
        </Grid>
        <Grid item sm={10}>
          <TextField value={etc} onChange={({target}) => handleChangeEtc(target.value)} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const BookProduct = ({typeValues, onChange}) => {
  const {author, isbn} = typeValues;

  const handleChangeAuthor = (value) => {
    onChange({
      ...typeValues,

      author: value
    });
  };

  const handleChangeIsbn = (value) => {
    onChange({
      ...typeValues,

      isbn: value
    });
  };

  return (
    <React.Fragment>
      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          저자
        </Grid>
        <Grid item sm={10}>
          <TextField value={author} onChange={({target}) => handleChangeAuthor(target.value)} />
        </Grid>
      </Grid>

      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          isbn
        </Grid>
        <Grid item sm={10}>
          <TextField value={isbn} onChange={({target}) => handleChangeIsbn(target.value)} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const MovieProduct = ({typeValues, onChange}) => {
  const {director, actor} = typeValues;

  const handleChangeDirector = (value) => {
    onChange({
      ...typeValues,

      director: value
    });
  };

  const handleChangeActor = (value) => {
    onChange({
      ...typeValues,

      actor: value
    });
  };

  return (
    <React.Fragment>
      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          감독
        </Grid>
        <Grid item sm={10}>
          <TextField value={director} onChange={({target}) => handleChangeDirector(target.value)} />
        </Grid>
      </Grid>

      <Grid item container sm={12} style={{marginBottom: '10px'}}>
        <Grid item sm={2}>
          배우
        </Grid>
        <Grid item sm={10}>
          <TextField value={actor} onChange={({target}) => handleChangeActor(target.value)} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ProductListTabPanel = () => {
  return (
    <ItemListProvider>
      <Grid container spacing={1} style={{alignItems: 'flex-start'}}>
        <Grid item sm={12}>
          <h3>상품 목록</h3>
        </Grid>

        <Grid item sm={12}>
          <TableContainer component={Paper}>
            <Table style={{minWidth: '700px'}}>
              <ItemListContext.Consumer>
                {({searchCondition, actions}) => (
                  <ProductListTableHead searchCondition={searchCondition} onChangeSearchCondition={actions.changeSearchCondition} />
                )}
              </ItemListContext.Consumer>

              <ProductListTableBody />
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </ItemListProvider>
  );
};

const ALL = 'ALL';

const ProductListTableHead = ({searchCondition, onChangeSearchCondition}) => {
  const nameRef = React.createRef();

  const [ properties, setProperties] = React.useState({
    itemType: searchCondition.itemType || ALL
  });

  const handleChangeItemType = (event) => {
    const { target } = event;
    const { value } = target;

    setProperties({
      ...properties,

      itemType: value
    });
  };

  const handleClickSearchButton = () => {
    const { itemType } = properties;

    onChangeSearchCondition({
      ...INIT_ITEM_SEARCH_CONDITION,

      itemType: itemType === ALL ? undefined : itemType,
      name: nameRef.current.value
    });
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell colSpan={7}>
          <div style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
            <Select value={properties.itemType} onChange={handleChangeItemType}>
              <MenuItem value={ALL}>전체</MenuItem>
              <MenuItem value={ITEM_TYPE.ALBUM}>앨범</MenuItem>
              <MenuItem value={ITEM_TYPE.MOVIE}>영화</MenuItem>
              <MenuItem value={ITEM_TYPE.BOOK}>책</MenuItem>
            </Select>

            <TextField inputRef={nameRef} />

            <Button variant={'contained'} color={'primary'} size={'small'} onClick={handleClickSearchButton}>검색</Button>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>No.</TableCell>
        <TableCell>이름</TableCell>
        <TableCell>가격</TableCell>
        <TableCell>재고</TableCell>
        <TableCell>타입값1</TableCell>
        <TableCell>타입값2</TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

const ProductListTableBody = () => {
  return (
    <ItemListContext.Consumer>
      {({items, actions, searchCondition}) => (
        <TableBody>
          {!items.length && (
            <TableRow></TableRow>
          )}
          {items.map((item, index) => (
            <ProductRow
             key={index}
             index={index}
             item={item}
             onChangeItem={item.itemType === ITEM_TYPE.ALBUM ? actions.modifyAlbum : item.itemType === ITEM_TYPE.BOOK ? actions.modifyBook : actions.modifyMovie}
             onRemoveItem={actions.removeItem} />
          ))}
        </TableBody>
      )}
    </ItemListContext.Consumer>
  );
};

const ProductRow = ({index, item, onChangeItem, onRemoveItem}) => {
  const { itemType, name, price, stockQuantity, artist, etc, author, isbn, director, actor } = item;

  return (
    <TableRow>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{price}</TableCell>
      <TableCell>{stockQuantity}</TableCell>

      {itemType === ITEM_TYPE.ALBUM && (
        <React.Fragment>
          <TableCell>{artist}</TableCell>
          <TableCell>{etc}</TableCell>
        </React.Fragment>
      )}

      {itemType === ITEM_TYPE.BOOK && (
        <React.Fragment>
          <TableCell>{author}</TableCell>
          <TableCell>{isbn}</TableCell>
        </React.Fragment>
      )}

      {itemType === ITEM_TYPE.MOVIE && (
        <React.Fragment>
          <TableCell>{director}</TableCell>
          <TableCell>{actor}</TableCell>
        </React.Fragment>
      )}

      <TableCell>
        <Button variant={'contained'} color={'primary'} size={'small'}>수정</Button>
        <Button variant={'contained'} color={'secondary'} size={'small'}>삭제</Button>
      </TableCell>
    </TableRow>
  );
};

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
        <Grid container spacing={1}>
          <Grid item sm={2}>
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
          </Grid>

          <Grid item sm={10}>
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
          </Grid>
        </Grid>
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