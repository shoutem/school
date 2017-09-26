import React from 'react';

export class ArticleView extends React.Component {
  static propTypes = {
    onPress: React.PropTypes.func,
    articleId: React.PropTypes.string,
    title: React.PropTypes.string,
    author: React.PropTypes.string,
    imageUrl: React.PropTypes.string,
    date: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress(this.props.articleId);
  }
}

