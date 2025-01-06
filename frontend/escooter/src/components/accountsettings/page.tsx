
import React from 'react';
import ChangePassword from '../ChangePassword/page';
import { fetchUserData } from '../../services/fetchUserData';
import { cookies } from 'next/headers';
const AccountSettingsMenu = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  const user = await fetchUserData(token);
  console.log(user);
  console.log("token in accountsettings",token);

  return (
    <div>
      <div>
        <ChangePassword token={token} user={user}  />
      </div>
    </div>
  );
};

export default AccountSettingsMenu;