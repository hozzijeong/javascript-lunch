import { mockRestaurant } from '../../src/data';

describe('점심 뭐 먹지 step-2 테스트', () => {
  beforeEach(() => {
    // 매 테스트 시작 전 localStorage에 값 세팅 및 view port 설정
    cy.visit('http://localhost:8080/', {
      onBeforeLoad(win) {
        const lists = mockRestaurant;
        const curList =
          JSON.parse(win.localStorage.getItem('restaurants') as string) || [];
        win.localStorage.setItem(
          'restaurants',
          JSON.stringify([...curList, ...lists])
        );
      },
    });
    cy.viewport(375, 667);
  });

  it('새로운 음식점을 추가 폼을 통해 음식점을 추가할 수 있고 새로고침 시에 추가된 음식점이 유지되는지 테스트 한다.', () => {
    // 기존 음식 리스트 길이
    const listLength = mockRestaurant.length;

    // modal 클릭
    cy.get('.gnb__button').click();

    // 값 세팅
    cy.get('#category').select('한식');
    cy.get('#name').type('서서갈비');
    cy.get('#distance').select('5');
    cy.get('#description').type('서서먹는 갈비입니다~');
    cy.get('#link').type('https://www.naver.com');

    // 추가 버튼 클릭
    cy.get("button[type='submit']").click();

    // 리스트 길이 추가 확인
    cy.get('.restaurant-list')
      .children()
      .should('have.length', listLength + 1);

    // 입력한 값이 존재하는지 확인
    cy.get('.restaurant-list').each((ele) => {
      cy.wrap(ele).find('.restaurant__name').should('contain.text', '서서갈비');
      cy.wrap(ele)
        .find('.restaurant__distance')
        .should('contain.text', '캠퍼스부터 5분 내');
      cy.wrap(ele)
        .find('.restaurant__description')
        .should('contain.text', '서서먹는 갈비입니다~');
    });

    //새로고침시에 값이 유지되었는지 확인
    cy.reload();
    cy.get('.restaurant-list')
      .children()
      .should('have.length', listLength + 1);
  });

  it('특정 음식점을 즐겨찾기 추가할 수 있고 및 즐겨찾기 탭에서 해당 음식점을 확인할 수 있다. 또한 새로고침 시에도 해당 정보가 유지되는지 테스트 한다.', () => {
    // 자주가는 음식점 목록 이동
    cy.get('.tab-container').each((ele) => {
      cy.wrap(ele).contains('자주가는 음식점').click();
    });

    // 피양콩 할머니 없는거 확인
    cy.get('.restaurant-list').each((ele) => {
      cy.wrap(ele)
        .find('.restaurant__name')
        .should('not.contain.text', '피양콩할마니');
    });

    // 모든 음식점 이동
    cy.get('.tab-container').each((ele) => {
      cy.wrap(ele).contains('모든 음식점').click();
    });

    // 피양콩 할머니 자주가는 음식점 등록
    cy.get('.restaurant-list').each((list) => {
      cy.wrap(list)
        .contains('피양콩할마니')
        .parentsUntil(list)
        .find('button')
        .click();
    });

    // 자주 가는 음식점 목록 이동
    cy.get('.tab-container').each((ele) => {
      cy.wrap(ele).contains('자주가는 음식점').click();
    });

    // 해당 list에 피양콩할마니 확인
    cy.get('.restaurant-list').each((ele) => {
      cy.wrap(ele)
        .find('.restaurant__name')
        .should('contain.text', '피양콩할마니');
    });

    cy.reload();

    cy.get('.restaurant-list').each((list) => {
      cy.wrap(list)
        .contains('피양콩할마니')
        .parentsUntil(list)
        .children()
        .should('have.class', 'favorite-filled');
    });
  });

  it('음식점의 상세보기를 확인하고 삭제버튼 클릭시에 해당 음식점이 삭제되었는지 확인한다. 그리고 새로고침 시에 삭제 정보가 유지되는지 테스트 한다.', () => {
    // 테스트 전 현재 list
    const listLength = mockRestaurant.length;

    // 피양콩 할마니 상세보기 이동
    cy.get('.restaurant-list').each((list) => {
      cy.wrap(list).contains('피양콩할마니').click();
    });

    //피양콩 할마니 정보 확인
    cy.get('.info-container')
      .find('.restaurant__category > img')
      .should('have.attr', 'alt', '한식');
    cy.get('.info-container')
      .find('.detail__name')
      .should('have.text', '피양콩할마니');
    cy.get('.info-container')
      .find('.detail__distance')
      .should('have.text', '캠퍼스부터 10분 내');
    cy.get('.info-container')
      .find('.detail__description')
      .should(
        'contain.text',
        '평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니.'
      );
    cy.get('.info-container')
      .find('.restaurant__description')
      .should('have.attr', 'href', 'https://www.naver.com');

    // 삭제하기 버튼 클릭
    cy.get('.info-container').each((ele) => {
      cy.wrap(ele).contains('삭제하기').click();
    });

    // 전체 목록에 피양콩 할마니 있는지 확인
    cy.get('.restaurant-list').each((ele) => {
      cy.wrap(ele)
        .find('.restaurant__name')
        .should('not.contain.text', '피양콩할마니');
    });

    // 전체 리스트 개수 줄었는지 확인
    cy.get('.restaurant-list')
      .children()
      .should('have.length', listLength - 1);

    cy.reload();

    cy.get('.restaurant-list').each((ele) => {
      cy.wrap(ele)
        .find('.restaurant__name')
        .should('not.contain.text', '피양콩할마니');
    });

    // 전체 리스트 개수 줄었는지 확인
    cy.get('.restaurant-list')
      .children()
      .should('have.length', listLength - 1);
  });

  it('음식점 카테고리를 선택하고, 거리순으로 정렬했을 때 필터링이 적용되는지 확인한다.', () => {
    // '한식' 카테고리 선택
    cy.get('#category-filter').select('한식');

    // 정렬된 값들이 "한식"인지 확인
    cy.get('.restaurant-list').each((restaurant) => {
      cy.wrap(restaurant).find('img').should('have.attr', 'alt', '한식');
    });

    // '거리' 기준으로 값 정렬
    cy.get('#sorting-filter').select('거리순');

    // '거리순' 으로 정렬되어있는지 확인
    const sortedRestaurant = [
      '용호낙지',
      '피양콩할마니',
      '농민 백암 순대',
      '진대감',
    ];

    cy.get('.restaurant-list')
      .children()
      .each((restaurant, index) => {
        cy.wrap(restaurant)
          .find('.restaurant__name')
          .should('have.text', sortedRestaurant[index]);
      });
  });
});
