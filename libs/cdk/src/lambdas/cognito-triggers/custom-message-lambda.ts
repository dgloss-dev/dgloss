import axios from 'axios';
import { CustomMessageTriggerEvent } from 'aws-lambda';

interface CognitoUserAttributes {
  email: string;
  name?: string;
  [key: string]: string | undefined;
}

const EMAIL_TEXT_MAP = {
  jp: { comma: '様' },
  en: { comma: ',' },
  CustomMessage_ForgotPassword: {
    jp: {
      locked: {
        subject: 'アカウントロック解除申請手続き',
        actionText: '新しいパスワードを設定する',
        paragraph:
          'アカウントロック解除のリクエストを受け付けました。下記のリンクをクリックして、新しいパスワードを設定してください。',
        loginText:
          'または、以下のリンクをコピーしてブラウザのアドレスバーに貼り付けてアクセスしてください。',
      },
      forgot: {
        subject: 'パスワードリセットのお知らせ',
        actionText: 'パスワードをリセットする',
        paragraph: 'パスワードを設定するには、下のボタンをクリックしてください。',
        loginText:
          'または、以下のリンクをコピーしてブラウザのアドレスバーに貼り付けてアクセスしてください。',
        footerOne:
          '※本メールにお心当たりがない場合は、誤ってアドレスが登録された可能性がございます。',
        footerTwo: 'その際は、お手数ですが本メールを破棄いただきますようお願いいたします。',
      },
    },
    en: {
      locked: {
        subject: 'Account unlock request procedure',
        actionText: 'Set new password',
        paragraph:
          'Your request to unlock your account has been accepted. Please click on the link below to set a new password.',
        loginText:
          "Or, copy and paste the following link into your browser's address bar to access it.",
      },
      forgot: {
        subject: 'Password reset notice',
        actionText: 'Reset your password',
        paragraph: 'Please click on the link below to reset your password.',
        loginText:
          "Or, copy and paste the following link into your browser's address bar to access it.",
        footerOne:
          'If you do not recognize this e-mail, your address may have been registered in error.',
        footerTwo: 'In that case, please discard this e-mail.',
      },
    },
  },
  CustomMessage_AdminCreateUser: {
    jp: {
      subject: 'パスワード設定のお知らせ',
      actionText: 'ログインしてアカウントを確認する',
      paragraphOne: 'いつも大阪ガスをご利用いただき、誠にありがとうございます。',
      paragraphTwo: 'この度、本メールアドレスにてアカウントが作成されました。',
      paragraphThree: '下記ボタンを押下し、パスワードの設定をお願いいたします。',
      loginText:
        'または、以下のリンクをコピーしてブラウザのアドレスバーに貼り付けてアクセスしてください。',
      footerOne:
        '※本メールにお心当たりがない場合は、誤ってアドレスが登録された可能性がございます。',
      footerTwo: 'その際は、お手数ですが本メールを破棄いただきますようお願いいたします。',
      footerThree: '今後とも、大阪ガスをよろしくお願いいたします。',
    },
    en: {
      subject: 'Password Setup Notice',
      actionText: 'Log in and verify your account',
      paragraphOne: 'Thank you for using Osaka Gas.',
      paragraphTwo: 'An account has now been created with this e-mail address.',
      paragraphThree: 'Please click the button below to set your password.',
      loginText:
        "Or, copy and paste the following link into your browser's address bar to access it.",
      footerOne:
        'If you do not recognize this e-mail, your address may have been registered in error.',
      footerTwo: 'In that case, please discard this e-mail.',
      footerThree: 'We look forward to your continued support of Osaka Gas.',
    },
  },
};

export const handler = async (
  event: CustomMessageTriggerEvent,
): Promise<CustomMessageTriggerEvent> => {
  const APP_URL = process.env.APP_URL;
  const APP_LIVE_URL = process.env.APP_LIVE_URL;
  const API_KEY = process.env.INTERNAL_API_KEY;

  const email = (event.request.userAttributes as CognitoUserAttributes).email;
  const name = (event.request.userAttributes as CognitoUserAttributes).name;
  const code = event.request.codeParameter;

  if (
    event.triggerSource === 'CustomMessage_ForgotPassword' ||
    event.triggerSource === 'CustomMessage_AdminCreateUser'
  ) {
    let endpoint = 'login';
    let actionText = EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.actionText;

    if (event.triggerSource === 'CustomMessage_ForgotPassword') {
      const response = await axios.post(
        `${process.env.API_URL}/auth/user-by-email`,
        { email },
        {
          headers: {
            'x-api-key': API_KEY,
          },
        },
      );

      const user = response.data?.data;
      const lang: 'en' | 'jp' = user?.preferredLang || 'jp';

      endpoint = 'forget-password';

      // Show a different template for locked account recovery
      actionText =
        user.status === 'locked'
          ? EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].locked.actionText
          : EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].forgot.actionText;
      const resetUrl = `${APP_LIVE_URL || APP_URL}/${endpoint}?code=${code}&email=${encodeURIComponent(email)}`;
      event.response.emailSubject =
        user.status === 'locked'
          ? EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].locked.subject
          : EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].forgot.subject;

      const paragraph =
        user?.status === 'locked'
          ? EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].locked.paragraph
          : EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].forgot.paragraph;

      event.response.emailMessage = `
      <html>
        <body>
          <p>${user?.username || name}${EMAIL_TEXT_MAP[lang].comma}</p>
          <p style="display: none;">Your verification code is: ${event.request.codeParameter}.</p>
          <p>${paragraph}</p>
          <p>
            <a href="${resetUrl}" style="padding: 10px 15px; border: 1px solid #70c159; color: #70c159; text-decoration: none; border-radius: 4px;">
              ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}
            </a>
          </p>
          <br />
          <p>${EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].forgot.loginText}</p>
          <p>${resetUrl}</p>
          ${
            user?.status !== 'locked'
              ? `<p>${EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].forgot.footerOne}</p>
            <p>${EMAIL_TEXT_MAP.CustomMessage_ForgotPassword[lang].forgot.footerTwo}</p>`
              : ''
          }
        </body>
      </html>
      `;

      return event;
    }

    // User creation is JP as user locale preference is N/A
    const loginUrl = `${APP_LIVE_URL || APP_URL}/${endpoint}?code=${code}&email=${encodeURIComponent(email)}`;

    event.response.emailSubject = EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.subject;

    /*
     * Using the username and code parameters are a requirement for Cognito to use this mail and not fallback
     * to the default. As showing this will cause confusion, it is hidden from the user.
     */
    event.response.emailMessage = `
      <html>
        <p>${name}${EMAIL_TEXT_MAP.jp.comma}</p>
        <body>
          <p style="display: none;">Your username is ${event.request.usernameParameter} and temporary password is ${event.request.codeParameter}.</p>

          <p>${EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.paragraphOne}</p>
          <p>${EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.paragraphTwo}</p>
          <p>${EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.paragraphThree}</p>

          <p>
            <a href="${loginUrl}" style="padding: 10px 15px; border: 1px solid #70c159; color: #70c159; text-decoration: none; border-radius: 4px;">
              ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}
            </a>
          </p>

          <br />
          <p>${EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.loginText}</p>
          <p>${loginUrl}</p>

          <p>${EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.footerOne}</p>
          <p>${EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.footerTwo}</p>
          <br />
          <p>${EMAIL_TEXT_MAP.CustomMessage_AdminCreateUser.jp.footerThree}</p>
        </body>
      </html>
    `;
  }

  return event;
};
