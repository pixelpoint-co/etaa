import React from 'react';
import { storiesOf } from '@storybook/react';
import Image from '.';

storiesOf('Image', module)
  .add('default', () => (
    <div>
      <Image
        width={250}
        height={200}
        src="data:image/jpeg;base64,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"
      />
    </div>
  ))
  .add('Avatar', () => (
    <div>
      <Image
        circle
        width={100}
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNIfDgxrHCNM3rxNayl6Z6mUclTdiosmnXNT_JKC1nPsfi7r56Gw"
      />
    </div>
  ));
