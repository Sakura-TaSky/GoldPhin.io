import { useCopyToClipboard, useTrim } from '@/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { BiSolidCopy } from 'react-icons/bi';
import { IoMdDoneAll } from 'react-icons/io';

const AccountInfo = () => {
  const { walletAddress, walletProfileImg, walletChain, walletBalance } =
    useSelector((state) => state.wallet);

  const { copy, isCopied } = useCopyToClipboard();

  const trim = useTrim();

  return (
    <div className="flex flex-col gap-3">
      <Avatar className="w-16 h-16 rounded-full object-cover">
        <AvatarImage src={walletProfileImg} alt="profile" />
        <AvatarFallback>#Phin</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 text-[13px] font-medium">
        <div className="flex flex-col">
          <span className="text-zinc-500">Address_</span>
          <span className="ml-4 break-all flex gap-2 items-center">
            {walletAddress ? walletAddress : 'connect wallet to view'}
            <i
              onClick={() => copy(walletAddress)}
              className={`p-1 cursor-pointer rounded ${
                isCopied ? '' : 'opacity-50 hover:opacity-100 hover:scale-110'
              } smooth`}
            >
              {isCopied ? (
                <IoMdDoneAll className="shrink-0 text-green-500" />
              ) : (
                <BiSolidCopy className="shrink-0" />
              )}
            </i>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-500">Network_</span>
          <span className="ml-4 break-all">
            {walletChain ? walletChain.name : 'connect wallet to view'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-zinc-500">Balance(usd)_</span>
          <span className="ml-4 break-all">
            {walletBalance
              ? `$${trim(walletBalance)}`
              : 'connect wallet to view'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
